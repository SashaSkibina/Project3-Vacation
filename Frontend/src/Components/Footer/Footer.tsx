import { Link, Typography } from "@mui/material";
import React from "react";
import { useStyles } from "../../theme";

function Footer(): JSX.Element {
    
    return (
        <div className={useStyles().footer}>
			<Typography variant="body2" color="white" align="center">
            {'Copyright © '}
            <Link color="inherit" href="" >
              Sasha Skibina
            </Link>{' '}
            {new Date().getFullYear()}.
          </Typography>
        </div>
    );
}

export default Footer;
