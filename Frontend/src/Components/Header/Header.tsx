import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { useStyles } from "../../theme";

function Header(): JSX.Element {
    const classes = useStyles();
    const logoStyle = {
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        border: '18px solid white',
        backgroundColor: 'white',
        margin: '-40px -40px -40px -80px'
    };

    return (
    <Box className={`${classes.defaultStyle}, ${classes.header}`} display="flex" alignItems="center" >
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" margin="auto">
            <Typography variant="h4" align="center">
                Vacation Master
            </Typography>
            <Typography variant="h6" align="center">
                Follow your dreams
            </Typography>
        </Box>    
        <Tooltip title="Home Page">
            <IconButton color="primary" component={Link} to="/">
                <div style={logoStyle}>
                    <img 
                        src={process.env.PUBLIC_URL + '/logo.png'} 
                        alt="Logo" 
                        style={{maxWidth: '100%', maxHeight: '100%'}}
                    />
                </div>
            </IconButton>
        </Tooltip>
    </Box>
    );
}

export default Header;
