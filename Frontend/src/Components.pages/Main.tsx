import {
  Box,
  Grid,
  IconButton,
  Pagination,
  PaginationItem,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import Vacation from "../models/vacation";
import serverURL from "../utils/ServerURLs";
import VacationForm from "../Components/VacationForm/VacationForm";
import store from "../redux/store";
import { logInUser, logOut, UserRole, userState } from "../redux/userAuth";
import { decodeToken } from "react-jwt";
import Like from "../models/likeModel";
import vacation from "../models/vacation";
import VacationCard, {
} from "../Components/VacationCard/VacationCard";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { useStyles } from "../theme";
import { Link, NavLink } from "react-router-dom";
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import CircularProgress from '@mui/material/CircularProgress';


function Main(): JSX.Element {
  // state for vacation array
  const [vacations, setVacations] = useState<Vacation[]>([]);
  // actual vacations to show (for handeling sorting and filtering)
  const [vacationDisplay, setVacationDisplay] = useState<Vacation[]>([]);
  // state for logged user object
  const [user, setUser] = useState<userState>(store.getState().authState);
  // state for showing/hiding loading animation
  const [loading, setLoading] = useState(true);
  //pagination
  const [page, setPage] = useState(0);
  //form autocomplete
  const [vacationState, setVacationState] = useState<Vacation>();
  //is form modal open
  const [formState, setFormState] = useState<boolean>(false);
  //switch for followedOnly
  const [checked, setChecked] = React.useState(false);

  useEffect(() => {
    //filter the displayed array onSwitch
    const handleChange = () => {
      if (checked) {
        setVacationDisplay(vacations.filter(item => item.is_liked));
      } else {
        setVacationDisplay(vacations);
      }
    };
    handleChange();
  },[checked])

  const log_Out = () => {
    store.dispatch(logOut());
  }

  const classes = useStyles();

  // sync vacationDisplay with fetched vacations
  useEffect(() => {
    setVacationDisplay(vacations);
  }, [vacations]);

  // set the state to auth.user state (we need id and role)
  store.subscribe(() => {
    setUser(store.getState().authState);
  });

  const handleChangePage = (event: ChangeEvent<unknown> | null, page: number): void => {
    setPage(page - 1);
  };
  
  //get all vacations ------------------------------------------------------
  const fetchVacations = async (user_id: number) => {
    let id:number;
    {typeof user_id !== "number" ? id = 0 : id = user_id}
    console.log("fetching all vacations for userId =", user_id);
    setLoading(true);
    await axios
      .get<Vacation[]>(serverURL.serverURL + "/main/vacation/" + id)
      .then((response) => {
        setVacations(response.data);
        setLoading(false);
      });
  };
  //get favorites(filter state array)
useEffect(() => {
    //if token is in localstorage but not in state
    if (
      localStorage.getItem("userToken") &&
      !store.getState().authState.user_token
    ) {
      checkSession();
    } else {
      fetchVacations(user.user_id);
    }
  }, [user]);
  
  //check authorization --> updatte localstorage and store
  const checkSession = async () => {
    console.log("checking session for token ",localStorage.getItem("userToken"));
    await axios
      .post(serverURL.serverURL + "/login/checkSession", "void", {
        headers: {
          'authorization': `Bearer ${localStorage.getItem("userToken")}`,
        },
      }) //add "void" as second parameter if not working
      .then((response) => {
        const tokenString = response.headers.authorization.split(" ")[1];
        if (tokenString) {
          const loggedUser: userState = (decodeToken(tokenString) as any).user;
          loggedUser.user_token = tokenString;
          //set new token in localstorage
          localStorage.setItem("userToken", tokenString);
          //update state
          loggedUser && store.dispatch(logInUser(loggedUser));
        }
      })
      .catch((error) => {
        fetchVacations(0);
        //setError(error.response.data) for this i need to create Error state object and useState
        console.log(error);
      });
  };

  // declaring functions that will be passed to VacationCard
  //like vacation
  const likeVacation = (like: Like) => {
    const index = vacationDisplay.findIndex((vacation) => vacation.v_id === like.v_id);
    if (vacationDisplay[index].is_liked) {
      console.log("error! according to the state the vacation is already liked");
    } else {
      axios
        .post(serverURL.serverURL + "/main/like/", like, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        })
        .then((response) => {
          if (response.headers.authorization) {
            localStorage.setItem("userToken", response.headers.authorization);
          }
          if (response.status === 201) {
            //find the index of this vacation in state array
            if (index !== -1) {
              const updatedVacations = [...vacationDisplay];
              //change state of like property
              updatedVacations[index].is_liked = true;
              updatedVacations[index].likes = updatedVacations[index].likes + 1;
              setVacations(updatedVacations);                    
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  //unlike vacation
  const unLikeVacation = (like: Like) => {
    axios
      .delete(
        serverURL.serverURL + "/main/like/" + like.user_id + "/" + like.v_id
      )
      .then((response) => {
        if (response.status === 204) {
          const index = vacationDisplay.findIndex(
            (vacation) => vacation.v_id === like.v_id
          );
          if (index !== -1) {
            const updatedVacations = [...vacationDisplay];
            //change state of like property
            updatedVacations[index].is_liked = false;
            updatedVacations[index].likes = updatedVacations[index].likes - 1;
            setVacations(updatedVacations);                      
            console.log("updatedVacations", updatedVacations);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // delete vacation 
  const deleteVacation = (v_id: number) => {
    console.log("click delete", v_id);
    axios
      .delete(serverURL.serverURL + "/main/vacation/" + v_id, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      })
      .then((response) => {
        if (response.headers.authorization) {
          localStorage.setItem("userToken", response.headers.authorization);
        }
        if (response.status === 204) {
          //find the index of this vacation in state array
          const index = vacationDisplay.findIndex(
            (vacation) => vacation.v_id === v_id
          );
          if (index !== -1) {
            //spread the vacationArr to a new one
            const updatedVacations = [...vacationDisplay];
            //filter the new arr excluding the deleted vacation
            updatedVacations.splice(index, 1);
            setVacations(updatedVacations);             
            console.log(updatedVacations);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

//onckick of edit btn in vacationCard we get a vacation obj
  const openEditForm = (vacation?: Vacation) => {
    console.log("openEditForm", vacation);
    //then we set a state for the single vacation obj
    setVacationState(vacation);
    setFormState(true);
  };
  //open form from the Add btn
  const handleClickOpen = () => {
    setVacationState(undefined);
    setFormState(true);
  };
  const handleClose = () => {
    setVacationState(undefined);
    setFormState(false);
  };

  //submitting the vacationForm: axios on IF (PUT || POST)
  const handleSubmit = (vacation: vacation) => {
    console.log("click submit", vacation);
    //if id exists then send Update
    if (vacation.v_id) {
      axios.put(serverURL.serverURL + "/main/vacation", vacation, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("userToken")}`,
            "content-type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.headers.authorization) {
            localStorage.setItem("userToken", response.headers.authorization);
          }
          if (response.status === 201) {
            //find the index of this vacation in state array
            const index = vacationDisplay.findIndex((v) => v.v_id === vacation.v_id);
            if (index !== -1) {
              console.log("editing vacation", vacationDisplay[index]);
              const updatedVacations = [...vacationDisplay];
              //modify the vacation inside the array
              updatedVacations[index] = vacation;
              setVacations(updatedVacations);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
      //else send Create
    } else {
      axios.post(serverURL.serverURL + "/main/vacation", vacation, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("userToken")}`,
            "content-type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.headers.authorization) {
            localStorage.setItem("userToken", response.headers.authorization);
          }
          if (response.status === 201) {
            const updatedVacations = [...vacationDisplay];
            updatedVacations.push(response.data);
            setVacations(updatedVacations); 
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setVacationState(undefined);
    setFormState(false);
  };
  
  return (
    <>
      <Box className={classes.defaultStyle} display="flex" justifyContent="center" alignItems="center">
        <Box display="flex" alignItems="flex-start" flexDirection="column">
          <Typography variant={"h6"}>
            Hello, { user.user_role == UserRole.guest ? "guest" : user.user_name}!
          </Typography>
          <Typography>
          {user.user_role == UserRole.guest ? 
            <>
              <NavLink to="/login">Log-in</NavLink>
              <span className={classes.navSeparator}></span>
              <NavLink to="/signup">Sign-up</NavLink>
            </> :
          <NavLink onClick={log_Out} to={""}>Log-out</NavLink>}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" flexGrow={1}>
          <Pagination
            sx={{ width: "fit-content" }}
            variant="outlined"
            shape="rounded"
            onChange={handleChangePage}
            count={Math.ceil(vacationDisplay.length / 10)}
            renderItem={(item) => <PaginationItem {...item} />}
          />
        </Box>
        <Box display="flex" alignItems="flex-end">
            {(user.user_role == UserRole.user) && (
              <Tooltip title={checked ? "Show all" : "Show followed only"}>
                <Switch
                  checked={checked}
                  onChange={()=>{setChecked(!checked)}}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </Tooltip> )
            }
            {(user.user_role == UserRole.admin) && (
              (<>
                <Tooltip title="View Statistics">
                  <IconButton color="primary" component={Link} to="/statistics">
                    <BarChartRoundedIcon fontSize="large"/>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Add Vacation">
                  <IconButton color="primary" onClick={() => handleClickOpen()}>
                    <AddCircleOutlineRoundedIcon fontSize="large"/>
                  </IconButton>
                </Tooltip>
              </>)
            )}
        </Box>
      </Box>

{/*  modal for form */}
      <VacationForm
        formState={formState}
        vacationState={vacationState}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
      />
{/* loading animation */}
      {loading && 
      <Box minHeight="200px" display="flex" justifyContent="center" alignItems={'center'}>
        <CircularProgress size={60} thickness={4}/>
      </Box>
      }
{/* cards */}
      <div>
        <Grid container spacing={2} alignItems={"center"}>
          {vacationDisplay.slice(page * 10, page * 10 + 10).map((vacation) => (
            <Grid key={vacation.v_id} item xs={12} sm={6}>
              <VacationCard
                key={vacation.v_id}
                {...vacation}
                likeNum={vacation.likes}
                // passing functions as props
                likeVacation={likeVacation}
                unLikeVacation={unLikeVacation}
                deleteVacation={deleteVacation}
                openEditForm={openEditForm}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </>
  );
}

export default Main;
