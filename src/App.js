import React, { Component } from "react";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";

import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";

import ForumIcon from "@material-ui/icons/Forum";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import PersonIcon from "@material-ui/icons/Person";
import ReactScrollbleFeed from "react-scrollable-feed";

import firebase from "firebase/app";
import "firebase/database";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Toolbar from "@material-ui/core/Toolbar";
import config from "./config";
import { withStyles } from "@material-ui/core/styles";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const useStyles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  root: {
    boxShadow: "none",
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttontext: "Show Chatroom",
      isLoggedIn: false,
      isavail: false,
      messages: [],
      rooms: [],
      users: [],
      value: "",
      name: "",
      room: "",
      database: null,
      timestamp: "",
      copiedText: "",
      usertext: "",
      copied: false,
      disable: false,
      search: "",
      searchuser: "",
      prevroom: "",
      valid: true,
      userexists: false,
      roomexists: false,
    };
    this.addClassroom = this.addClassroom.bind(this);
  }

  chatElement = React.createRef();

  // ampm(e) {
  //   var a = e;
  //   console.log(a);

  //   var hours = a.toLocaleString().split(" ")[4];
  //   var minutes = a.split(" ")[4].split(":")[1];
  //   var ampm = hours >= 12 ? "pm" : "am";
  //   hours = hours % 12;
  //   hours = hours ? hours : 12; // the hour '0' should be '12'
  //   minutes = minutes < 10 ? "0" + minutes : minutes;
  //   var strTime = hours + ":" + minutes + " " + ampm;
  //   return strTime;
  // }

  usersubmit = (value) => {
    console.log(this.state.userexists + " FEFD" + this.state.roomexists);

    if (this.state.userexists && this.state.roomexists) {
      console.log("exists both");
      this.state.database
        .ref("chatUser/" + this.state.room)
        .orderByChild("name")
        .equalTo(this.state.name)
        .once("value")
        .then((snap) => {
          if (snap.exists()) {
            // console.log("exists user in chatroom");
          } else {
            this.state.database.ref("chatUser/" + this.state.room).push({
              name: this.state.name,
            });
          }
        });
      this.setState({ isLoggedIn: true, isavail: false });
    } else if (
      this.state.userexists === true &&
      this.state.roomexists === false
    ) {
      if (
        (this.state.room.length < 4) |
        (this.state.room.length > 12) |
        this.state.room.includes(" ") |
        (this.state.room === "")
      ) {
        this.setState({
          isLoggedIn: false,
          isavail: false,
          valid: false,
        });
      } else {
        this.state.database.ref("chatroom").push({
          name: this.state.room,
        });
        this.state.database
          .ref("Messages")
          .child(this.state.room)
          .push({
            name: "Admin",
            message: "Welcome to  " + this.state.room,
            timestamp: Date.toLocaleString(),
          });
        this.state.database
          .ref("chatUser/" + this.state.room)
          .orderByChild("name")
          .equalTo(this.state.name)
          .once("value")
          .then((snap) => {
            if (snap.exists()) {
              // console.log("exists user in chatroom");
            } else {
              this.state.database.ref("chatUser/" + this.state.room).push({
                name: this.state.name,
              });
            }
          });
        this.setState({ isLoggedIn: true, isavail: false });
      }
    } else if (
      this.state.userexists === false &&
      this.state.roomexists === true
    ) {
      if (
        (this.state.name.length < 4) |
        (this.state.name.length > 8) |
        this.state.name.includes(" ") |
        (this.state.name === "")
      ) {
        this.setState({
          isLoggedIn: false,
          isavail: false,
          valid: false,
        });
      } else {
        this.setState({ isLoggedIn: true, valid: true, isavail: false });

        this.state.database.ref("chat").push({
          user: this.state.name,
        });
        this.state.database
          .ref("chatUser/" + this.state.room)
          .orderByChild("name")
          .equalTo(this.state.name)
          .once("value")
          .then((snap) => {
            if (snap.exists()) {
              // console.log("exists user in chatroom");
            } else {
              this.state.database.ref("chatUser/" + this.state.room).push({
                name: this.state.name,
              });
            }
          });
      }
    } else {
      if (
        (this.state.room.length < 4) |
        (this.state.room.length > 12) |
        this.state.room.includes(" ") |
        (this.state.room === "") |
        (this.state.name.length < 4) |
        (this.state.name.length > 8) |
        this.state.name.includes(" ") |
        (this.state.name === "")
      ) {
        this.setState({
          isLoggedIn: false,
          isavail: false,
          valid: false,
        });
      } else {
        this.state.database.ref("chat").push({
          user: this.state.name,
        });
        this.state.database.ref("chatroom").push({
          name: this.state.room,
        });
        this.state.database
          .ref("Messages")
          .child(this.state.room)
          .push({
            name: "Admin",
            message: "Welcome to  " + this.state.room,
            timestamp: Date.toLocaleString(),
          });
        this.state.database
          .ref("chatUser/" + this.state.room)
          .orderByChild("name")
          .equalTo(this.state.name)
          .once("value")
          .then((snap) => {
            if (snap.exists()) {
              // console.log("exists user in chatroom");
            } else {
              this.state.database.ref("chatUser/" + this.state.room).push({
                name: this.state.name,
              });
            }
          });
        this.setState({ isLoggedIn: true, isavail: false });
      }
    }

    this.state.database
      .ref()
      .child("Messages")
      .child(this.state.room)
      .on("child_added", (snapshot) => {
        this.setState((state) => ({
          messages: [...state.messages, snapshot.val()],
        }));
        // console.log(snapshot.val());
      });
    //chatrooms add to state

    value.preventDefault();
  };
  getrooms = async (e) => {
    if (!this.state.isavail) {
      this.setState({
        isavail: true,
        buttontext: "Hide Chatrooms",
      });
      this.state.database
        .ref()
        .child("chatroom")
        .orderByChild("name")
        .on("child_added", (snapshot) => {
          this.setState((state) => ({
            rooms: [...state.rooms, snapshot.val()],
          }));
        });
    } else {
      this.setState({
        isavail: false,
        rooms: [],
        buttontext: "Show Chatrooms",
      });
    }
    e.preventDefault();
  };

  addClassroom = (e) => {
    this.setState({
      room: e.target.value,
    });

    e.preventDefault();
  };

  showuser = (e) => {
    // console.log(e);
    if (!this.state.isusershown) {
      this.setState({
        isusershown: true,
        usertext: "Hide Members",
      });
      this.state.database
        .ref()
        .child("chatUser/" + this.state.room)
        .orderByChild("name")
        .on("child_added", (snapshot) => {
          this.setState((state) => ({
            users: [...state.users, snapshot.val()],
          }));
        });
    } else {
      this.setState({
        isusershown: false,
        users: [],
        usertext: "Show Members",
      });
    }
    e.preventDefault();
  };

  backClick = (e) => {
    this.setState({
      isLoggedIn: false,
      isusershown: false,
      preroom: this.state.room,
      value: "",
      copiedText: "",
      userexists: false,
      roomexists: false,

      name: "",
      rooms: [],
      messages: [],
      users: [],

      buttontext: "Show Chatrooms",
    });
    e.preventDefault();
  };

  onButtonClicked = (e) => {
    if (!this.state.value.replace(/\s/g, "").length) {
    } else {
      this.state.database.ref("Messages").child(this.state.room).push({
        name: this.state.name,
        message: this.state.value,
        timestamp: this.state.timestamp,
      });
      // this.client.send(
      //   JSON.stringify({
      //     type: "message",
      //     message: this.state.value,
      //     name: this.state.name,
      //     timestamp: this.state.timestamp,
      //   })
      // );
    }
    this.setState({ value: "", isLoggedIn: true });

    e.preventDefault();
  };

  onCopy = () => {
    this.setState({ copied: true });
  };

  componentDidMount() {
    if ((this.state.room === "") | (this.state.name === "")) {
      this.setState({
        disable: true,
      });
    }

    // console.log("mount" + this.state.room);
    firebase.initializeApp(config);
    this.setState({
      database: firebase.database(),
    });
  }

  search = (e) => {
    this.setState({
      search: e.target.value,
    });
  };

  searchuser = (e) => {
    this.setState({
      searchuser: e.target.value,
    });
  };
  render() {
    const { classes } = this.props;
    const uniqueMessages = [];
    this.state.messages.map((item) => {
      var findItem = uniqueMessages.find(
        (x) =>
          x.timestamp === item.timestamp &&
          x.message === item.message &&
          x.name === item.name
      );
      if (!findItem) uniqueMessages.push(item);
      return true;
    });

    const uniqueusers = [];
    this.state.users.map((item) => {
      var findItem = uniqueusers.find((x) => x.name === item.name);
      if (!findItem) uniqueusers.push(item);
      return true;
    });
    const filterRooms = this.state.rooms.filter((room) => {
      return (
        room.name.toUpperCase().search(this.state.search.toUpperCase()) !== -1
      );
    });
    const filterusers = uniqueusers.filter((user) => {
      return (
        user.name.toUpperCase().search(this.state.searchuser.toUpperCase()) !==
        -1
      );
    });
    // console.log("render");
    return (
      <Grid
        Container
        component="main"
        style={{ overflowX: "hidden" }}
        maxWidth="xs"
      >
        <Grid item xs={12}>
          <Grid container justify="center" spacing={5}>
            <Grid item>
              {this.state.isavail ? (
                <div style={{ marginTop: 60 }} className={classes.paper}>
                  <Typography
                    component="h1"
                    style={{ marginBottom: 20, overflowX: "hidden" }}
                    variant="h5"
                  >
                    Active ChatRooms<br></br>
                    <TextField
                      marginBottom="0"
                      className={classes.main}
                      label="Search"
                      onChange={this.search}
                    />
                  </Typography>
                  <Paper
                    variant="outlined"
                    backgroundColor="primary"
                    elevation={3}
                    style={{
                      height: 300,
                      maxHeight: 400,
                      width: 250,

                      overflow: "auto",
                      boxShadow: "none",
                    }}
                  >
                    {filterRooms.length === 0 ? (
                      <Loader
                        marginTop={50}
                        type="Bars"
                        color="grey"
                        height={80}
                        width={200}
                        style={{ marginTop: 50, marginLeft: 30 }}
                      />
                    ) : (
                      filterRooms.map((room, i) => (
                        <>
                          <center>
                            <CopyToClipboard
                              onCopy={this.onCopy}
                              text={room.name}
                            >
                              <Button
                                style={{ width: 220 }}
                                value={room.name}
                                text={room.name}
                                onClick={() =>
                                  this.setState({
                                    copiedText: room.name,
                                  })
                                }
                              >
                                <Card className={classes.main}>
                                  <CardHeader
                                    style={{ width: 220 }}
                                    avatar={
                                      <IconButton
                                        className={classes.main}
                                        aria-label="add"
                                      >
                                        <ForumIcon />
                                      </IconButton>
                                    }
                                    title={room.name}
                                    subheader={
                                      this.state.copiedText === room.name
                                        ? "copied"
                                        : ""
                                    }
                                  />
                                </Card>
                              </Button>
                            </CopyToClipboard>
                          </center>
                        </>
                      ))
                    )}
                    {}
                  </Paper>
                  click on room name to copy on clipboard
                </div>
              ) : this.state.isusershown ? (
                <div style={{ marginTop: 60 }} className={classes.paper}>
                  <Typography
                    component="h1"
                    style={{ marginBottom: 20, overflowX: "hidden" }}
                    variant="h5"
                  >
                    All Users<br></br>
                    <TextField label="Search" onChange={this.searchuser} />
                  </Typography>

                  <Paper
                    variant="outlined"
                    backgroundColor="primary"
                    elevation={3}
                    style={{
                      height: 300,
                      maxHeight: 400,
                      width: 250,
                      overflowX: "hidden",
                      overflow: "auto",
                      boxShadow: "none",
                    }}
                  >
                    {filterusers.length === 0 ? (
                      <Loader
                        marginTop={50}
                        type="Bars"
                        color="grey"
                        height={80}
                        width={200}
                        style={{ marginTop: 50, marginLeft: 30 }}
                      />
                    ) : (
                      filterusers.map((user, i) => (
                        <>
                          <center>
                            <Button
                              value={user.name}
                              text={user.name}
                              style={{ width: 220 }}
                            >
                              <Card className={classes.main}>
                                <CardHeader
                                  style={{ width: 240 }}
                                  avatar={
                                    <IconButton
                                      className={classes.main}
                                      aria-label="add"
                                    >
                                      <PermIdentityIcon />
                                    </IconButton>
                                  }
                                  title={user.name}
                                />
                              </Card>
                            </Button>
                          </center>
                        </>
                      ))
                    )}
                  </Paper>
                </div>
              ) : (
                <span></span>
              )}
            </Grid>

            <Grid item>
              {this.state.isLoggedIn ? (
                <div style={{ marginTop: 50 }}>
                  <AppBar position="static" color="primary">
                    <Toolbar>
                      <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={this.backClick}
                      >
                        <ArrowBackIosIcon />
                      </IconButton>
                      <Typography variant="h6" className={classes.title}>
                        {this.state.room.toUpperCase()}
                      </Typography>
                      <IconButton color="inherit" onClick={this.showuser}>
                        <PersonIcon />
                      </IconButton>
                    </Toolbar>
                  </AppBar>

                  <Paper
                    elevation={3}
                    style={{
                      height: 400,
                      maxHeight: 500,
                      width: 350,
                      overflow: "auto",
                      boxShadow: "none",
                    }}
                  >
                    <ReactScrollbleFeed>
                      {uniqueMessages.map((message, i) => (
                        <>
                          <Card className={classes.root}>
                            <CardHeader
                              avatar={
                                <Avatar className={classes.avatar}>
                                  {message.name[0]}
                                </Avatar>
                              }
                              title={
                                message.name +
                                " " +
                                message.timestamp.split(" ")[4]
                              }
                              subheader={message.message}
                            />
                          </Card>
                        </>
                      ))}
                    </ReactScrollbleFeed>
                  </Paper>
                  <form
                    className={classes.form}
                    noValidate
                    width="300"
                    onSubmit={this.onButtonClicked}
                  >
                    <TextField
                      id="outlined-helperText"
                      label="Type Your message...."
                      variant="outlined"
                      value={this.state.value}
                      fullWidth
                      endAdornment={
                        <InputAdornment position="end">
                          <SearchIcon />
                        </InputAdornment>
                      }
                      onChange={(e) => {
                        this.setState({
                          value: e.target.value,
                          timestamp: Date().toLocaleString(),
                        });
                        this.value = this.state.value;
                      }}
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                    >
                      Send
                    </Button>
                  </form>
                </div>
              ) : (
                <>
                  <CssBaseline />
                  <div className={classes.paper}>
                    <Toolbar>
                      <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={this.getrooms}
                      >
                        <Grid container xs="12">
                          <Grid
                            item
                            style={{ marginTop: 4, marginBottom: 0 }}
                            justify="flex-start"
                          >
                            {this.state.isavail ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </Grid>
                          <Grid item justify="flex-end">
                            <Typography variant="h5" style={{ marginLeft: 20 }}>
                              {this.state.buttontext}
                            </Typography>
                          </Grid>
                        </Grid>
                      </IconButton>
                    </Toolbar>
                    <form className={classes.form} noValidate>
                      <TextField
                        width="350"
                        variant="outlined"
                        margin="normal"
                        required
                        // disabled
                        fullWidth
                        id="email"
                        label="Chatroom Name"
                        name="Chatroom Name"
                        autoFocus
                        ref={this.chatElement}
                        value={this.state.room}
                        onChange={(e) => {
                          this.setState({
                            room: e.target.value.toUpperCase(),
                            roomexists: false,
                          });
                          //  this.state.value = this.state.room;
                          if (this.state.room === "") {
                            this.setState({
                              disable: true,
                              valid: false,
                            });
                          } else {
                            this.setState({
                              disable: false,
                              valid: true,
                            });
                          }

                          this.state.database
                            .ref()
                            .child("chatroom")
                            .orderByChild("name")
                            .equalTo(e.target.value.toUpperCase())
                            .once("value")
                            .then((snapshot) => {
                              if (snapshot.exists()) {
                                //  roomexists = true;
                                this.setState({
                                  roomexists: true,
                                });
                              }
                            });
                          e.preventDefault();
                        }}
                        onFocus={(e) => {
                          if (this.state.database !== null) {
                            this.state.database
                              .ref()
                              .child("chatroom")
                              .orderByChild("name")
                              .equalTo(this.state.room)
                              .once("value")
                              .then((snapshot) => {
                                if (snapshot.exists()) {
                                  //  roomexists = true;
                                  this.setState({
                                    roomexists: true,
                                  });
                                }
                              });
                          }
                        }}
                      />

                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="Username"
                        label="Username"
                        type="Username"
                        id="Username"
                        value={this.state.name}
                        onChange={(e) => {
                          this.setState({
                            name: e.target.value.toUpperCase(),
                            userexists: false,
                          });

                          // this.state.value = this.state.name;
                          if (this.state.name === "") {
                            this.setState({
                              disable: true,
                              valid: false,
                            });
                          } else {
                            this.setState({
                              disable: false,
                              valid: true,
                            });
                          }

                          this.state.database
                            .ref()
                            .child("chat")
                            .orderByChild("user")
                            .equalTo(e.target.value.toUpperCase())
                            .once("value")
                            .then((snapshot) => {
                              if (snapshot.exists()) {
                                // userexists = true;
                                this.setState({
                                  userexists: true,
                                });
                              }
                            });
                          e.preventDefault();
                        }}
                        onFocus={(e) => {
                          if (this.state.database !== null) {
                            this.state.database
                              .ref()
                              .child("chat")
                              .orderByChild("user")
                              .equalTo(this.state.name)
                              .once("value")
                              .then((snapshot) => {
                                if (snapshot.exists()) {
                                  // userexists = true;
                                  this.setState({
                                    userexists: true,
                                  });
                                }
                              });
                          }
                        }}
                      />
                      <span style={{ color: "red" }}>
                        {this.state.valid ? "" : "Invalid  crendentials"}
                      </span>
                      <Button
                        type="submit"
                        id="joinbtn"
                        maxWidth="500"
                        fullWidth
                        disabled={this.state.disable}
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={this.usersubmit}
                      >
                        Join Chatroom
                      </Button>

                      <br></br>
                      <center>
                        <span center color="blue">
                          User length should be between 4 and 8 <br></br>
                          Room length should be between 4 and 12<br></br>
                          should not contain space
                        </span>
                      </center>
                    </form>
                  </div>
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
export default withStyles(useStyles)(App);
