import Vacation from "../../models/vacation";
import { Card, CardHeader, CardMedia, CardContent, Typography, Button, CssBaseline, Container, IconButton, Tooltip, CardActions } from "@mui/material";
import React, { useEffect, useState } from "react";
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import serverURL from "../../utils/ServerURLs";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import store from "../../redux/store";
import { UserRole } from "../../redux/userAuth";
import Like from "../../models/likeModel";
import dayjs from "dayjs";
import { useStyles } from "../../theme";
import AlertModal from "../AlertModal/AlertModal";

export interface VacationCardProps extends Vacation {
  likeVacation: (like: Like) => void;
  unLikeVacation: (like: Like) => void;
  deleteVacation: (v_id: number) => void;
  likeNum: number;
  openEditForm: (vacation:Vacation) => void;
}
// vacation card recieves a single Vacation object as params(props)
// inside the vacation object we also have callback functions 
function VacationCard(vacation: VacationCardProps): JSX.Element {
  //this state is to display a like btn
  const [isLiked, setIsLiked] = useState<boolean>(vacation.is_liked);
  const [likeNum, setLikeNum] = useState<number>(vacation.likes);
  //errorModal state
  const [open, setOpen] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  //const [render, setRender] = useState<boolean>(false);
  //state of vacationForm
  //const []

  useEffect (() => {
    setLikeNum(vacation.likes);
    setIsLiked(vacation.is_liked);
  },[vacation.likes, vacation.is_liked])

  // store.subscribe(() => {
  //   setRender(!render)
  // })

  const like: Like = {
    id: vacation.id,
    v_id: vacation.v_id,
    user_id: store.getState().authState.user_id,
    user_name: store.getState().authState.user_name,
    user_role: store.getState().authState.user_role
  }
 
  const toggleLike = (v_id: number) => {
    const userRole = store.getState().authState.user_role;
    if ( userRole == UserRole.guest) {
      console.log("this option is availible only to registered users. Sigh-up for free!")
    }
    else if (userRole == UserRole.admin) {
      console.log("this option is not availible to the administrator!")
    }
    else {
      if (isLiked) {
        vacation.unLikeVacation(like);
      } else {
        vacation.likeVacation(like);
      }
    }
  }

  const showAlert = () => {
    const role = store.getState().authState.user_role;
    setOpen(true);
    const userRole = store.getState().authState.user_role;
    if (userRole == UserRole.admin) {
      setMsg( "This option is availible to regular users only!" );
    } else {
      setMsg("This option is availible to registered users only!");
    }
  }

  const handleClose = () => {
    setOpen(false);
  }

  const classes = useStyles();

  return (
    <Card sx={{ maxWidth: 400, padding: 0}} className={classes.defaultStyle}>
      <AlertModal msg={msg} open={open} handleClose={handleClose}/>
      <CardHeader 
        title={vacation.destination}
        subheader={`${dayjs(vacation.start_date).format("DD/MM/YYYY")} - ${dayjs(vacation.end_date).format("DD/MM/YYYY")}`} //formatSqlDate
        action={
          <>
            {store.getState().authState.user_role == UserRole.admin &&
              <>
                <Tooltip title="Edit">
                    <IconButton  color="primary" onClick={()=>vacation.openEditForm(vacation)}>
                        <EditRoundedIcon />
                    </IconButton>
                </Tooltip>
                  {/* here we activate one of the callbacks and pass data to it */}
                <Tooltip title="Delete">
                  <IconButton onClick={() => vacation.deleteVacation(vacation.v_id)} color="primary">
                    <DeleteRoundedIcon/>
                  </IconButton>
                </Tooltip>
              </>
            }
          </>
        }
      />
      
      <CardMedia 
        component="img" 
        height="220" 
        image={serverURL.serverURL + "/images/" + vacation.image} 
        title={vacation.destination}
        alt="image not found"/>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {vacation.description}
        </Typography>
        <Typography>
          Price: ${vacation.price}
        </Typography>
        <CardActions disableSpacing>
          <Typography variant="body2">
            <Tooltip title={isLiked ? "unfollow" : "follow"}>
              <IconButton 
                onClick={()=> {
                  (store.getState().authState.user_role == UserRole.user) ? 
                  toggleLike(vacation.v_id) :
                  showAlert()
                }}
                color="error"
              >
                {isLiked ? <FavoriteRoundedIcon fontSize="large"/> : <FavoriteBorderRoundedIcon fontSize="large"/>}
              </IconButton>
            </Tooltip>
              {likeNum} followers
          </Typography>
        </CardActions>
      </CardContent>
    </Card>
    
  );
}

export default VacationCard;
