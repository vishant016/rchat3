import React, { Component } from "react";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import ForumIcon from "@material-ui/icons/Forum";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import PersonIcon from "@material-ui/icons/Person";
import ReactScrollbleFeed from "react-scrollable-feed";
import { w3cwebsocket as W3CWebSocket } from "websocket";
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
    this.state.database
      .ref()
      .child("chat")
      .orderByChild("user")
      .equalTo(this.state.name)
      .once("value")
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log("update" + this.state.room);

          this.client = new W3CWebSocket(
            "ws://chatdjangoapp.herokuapp.com/ws/chatapp/" +
              this.state.room +
              "/"
          );
          this.client.onopen = () => {
            console.log("WebSocket Client Connected update " + this.state.room);
          };
          this.setState({ isLoggedIn: true, isavail: false });
        } else {
          if (
            (this.state.name.length < 4) |
            (this.state.name.length > 8) |
            this.state.name.includes(" ") |
            (this.state.name === "") |
            (this.state.room === "")
          )
            this.setState({ isLoggedIn: false, isavail: true });
          else {
            console.log("update" + this.state.room);
            this.client = new W3CWebSocket(
              "ws://chatdjangoapp.herokuapp.com/ws/chatapp/" +
                this.state.room +
                "/"
            );
            this.client.onopen = () => {
              console.log(
                "WebSocket Client Connected update " + this.state.room
              );
            };
            this.setState({ isLoggedIn: true, isavail: false });

            this.state.database.ref("chat").push({
              user: this.state.name,
            });
          }
        }
      });

    this.state.database
      .ref()
      .child("chatroom")
      .orderByChild("name")
      .equalTo(this.state.room)
      .once("value")
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log("exists chatroom");
        } else {
          if (
            (this.state.room.length < 4) |
            (this.state.room.length > 12) |
            this.state.room.includes(" ") |
            (this.state.room === "")
          )
            this.setState({ isLoggedIn: false, isavail: true });
          else {
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
            this.setState({ isLoggedIn: true, isavail: false });
          }
        }
      });

    this.state.database
      .ref("chatUser/" + this.state.room)
      .orderByChild("name")
      .equalTo(this.state.name)
      .once("value")
      .then((snap) => {
        if (snap.exists()) {
          console.log("exists user in chatroom");
        } else {
          this.state.database.ref("chatUser/" + this.state.room).push({
            name: this.state.name,
          });
        }
      });

    this.state.database
      .ref()
      .child("Messages")
      .child(this.state.room)
      .on("child_added", (snapshot) => {
        this.setState((state) => ({
          messages: [...state.messages, snapshot.val()],
        }));
        console.log(snapshot.val());
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
    console.log(e);
    if (!this.state.isusershown) {
      this.setState({
        isusershown: true,
        usertext: "Hide Members",
      });
      this.state.database
        .ref()
        .child("chatUser/" + this.state.room)
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
      value: "",
      copiedText: "",
      rooms: [],
      messages: [],
      isavail: false,
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
      this.client.send(
        JSON.stringify({
          type: "message",
          message: this.state.value,
          name: this.state.name,
          timestamp: this.state.timestamp,
        })
      );
    }
    this.setState({ value: "", isLoggedIn: true });

    e.preventDefault();
  };

  componentDidMount() {
    console.log("mount" + this.state.room);
    firebase.initializeApp(config);
    this.setState({
      database: firebase.database(),
    });
  }

  render() {
    const { classes } = this.props;
    console.log("render");
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
                    Active ChatRooms
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
                    {this.state.rooms.map((room) => (
                      <>
                        <center>
                          <Button
                            value={room.name}
                            text={room.name}
                            onClick={() =>
                              navigator.clipboard.writeText(room.name)
                            }
                          >
                            <Card className={classes.main}>
                              <CardHeader
                                avatar={
                                  <IconButton
                                    className={classes.main}
                                    aria-label="add"
                                  >
                                    <ForumIcon />
                                  </IconButton>
                                }
                                title={room.name}
                              />
                            </Card>
                          </Button>
                        </center>
                      </>
                    ))}
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
                    All Users
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
                    {this.state.users.map((user) => (
                      <>
                        <center>
                          <Button value={user.name} text={user.name}>
                            <Card className={classes.main}>
                              <CardHeader
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
                    ))}
                  </Paper>
                </div>
              ) : (
                <Grid></Grid>
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
                      width: 400,
                      overflow: "auto",
                      boxShadow: "none",
                    }}
                  >
                    <ReactScrollbleFeed>
                      {this.state.messages.map((message) => (
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
                    onSubmit={this.onButtonClicked}
                  >
                    <TextField
                      id="outlined-helperText"
                      label="Type Your message...."
                      variant="outlined"
                      value={this.state.value}
                      fullWidth
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
                <div>
                  <CssBaseline />
                  <div className={classes.paper}>
                    <Toolbar>
                      <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={this.getrooms}
                      >
                        {this.state.isavail ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                      <Typography variant="h6" className={classes.title}>
                        {this.state.buttontext}
                      </Typography>
                    </Toolbar>
                    <form className={classes.form} noValidate>
                      <TextField
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
                          this.setState({ room: e.target.value.toUpperCase() });
                          this.value = this.state.room;
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
                          this.setState({ name: e.target.value.toUpperCase() });
                          this.value = this.state.name;
                          e.preventDefault();
                        }}
                      />

                      <Button
                        type="submit"
                        maxWidth="500"
                        fullWidth
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
                </div>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
export default withStyles(useStyles)(App);
