import Button from "@mui/material/Button/Button";
import Dialog from "@mui/material/Dialog/Dialog";
import DialogContent from "@mui/material/DialogContent/DialogContent";
import DialogTitle from "@mui/material/DialogTitle/DialogTitle";
import React from "react";
import { useStyles } from "../../theme";

interface AlertModalProps {
    msg: string;
    open: boolean;
    handleClose:() => void;
}

function AlertModal(props: AlertModalProps): JSX.Element {
    return (
        <div className="VacationForm">
        <Dialog 
            open={props.open} 
            onClose={props.handleClose} 
            fullWidth={true}
            maxWidth="sm"
            className={useStyles().defaultStyle}
        >
            <DialogTitle>
                Oops!
            </DialogTitle>
            <DialogContent>
            {props.msg}
            <Button fullWidth onClick={props.handleClose}>Ok</Button>
            </DialogContent>
        </Dialog>
        </div>
    );
}

export default AlertModal;
