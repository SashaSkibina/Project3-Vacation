import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, Grid,  TextField} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Vacation from "../../models/vacation";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import 'dayjs/locale/fr';
import dayjs from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers/DatePicker/DatePicker";
import AlertModal from "../AlertModal/AlertModal";

//vIdState={vIdState} handleClose={close modal by changing state} handleSubmit={callback that should return Vacation}

function VacationForm(props:any): JSX.Element {

    const style = {color: "red"};

    const {register, control, handleSubmit, setValue, reset, formState: { errors }} = useForm<Vacation>()
    //const [open, setOpen] = useState<boolean>(false); //could be used for errors?
    //date pickers state
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    //picture state
    //for preview
    const [imageState, setImageState] = useState<string | ArrayBuffer | null>();
    //actual file
    const [image, setImage] = useState("");
    //errorModal state
    const [open, setOpen] = useState<boolean>(false);
    const [msg, setMsg] = useState<string>("");

    const vacation: Vacation = props.vacationState
    //const navigate = useNavigate(); //since it's a modal me should not navigate?
    
    useEffect(() => {
        //if vacation came back from clickEdit
        if (vacation) {
            setValue("destination", vacation.destination);
            setValue("description", vacation.description);
            setValue("image", vacation.image);
            setValue("start_date",dayjs(vacation.start_date).format("YYYY-MM-DD")); //props send string, state is Date?
            setValue("end_date", dayjs(vacation.end_date).format("YYYY-MM-DD")); 
            setValue("price", vacation.price);
            setValue("v_id", vacation.v_id);
            setValue("actual_image", vacation.actual_image);
        }
    },[vacation])
    

    const handleReset = () => {
        reset();
    };

    const checkData = (data: Vacation) => {
        if (typeof data.start_date === "object" || typeof data.end_date === "object") {
            setOpen(true);
            setMsg( "Please fill in the dates" );
        } else {
            data.actual_image = image;
            console.log(data);
            props.handleSubmit(data);
        }
    }

    const handleClose = () => {
        setOpen(false);
      }

    return (
        <div className="VacationForm">
            <AlertModal msg={msg} open={open} handleClose={handleClose}/>
                <Dialog 
                    open={props.formState} 
                    onClose={props.handleClose} 
                    fullWidth={true}
                    maxWidth="sm">
                    <DialogTitle>
                        {vacation ? "Edit vacation" : "Add vacation"}
                    </DialogTitle>
                    <DialogContent>
                    <Box component="form" noValidate onSubmit={handleSubmit((data) => {checkData(data)})} sx={{ mt: 1}}>
                        <FormControl sx={{ m: 8 }} >
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField type="hidden" {...register("v_id")}/>
                                    <TextField                       
                                        required
                                        id="destination"
                                        label="destination"
                                        autoComplete="destination"
                                        size="small"
                                        autoFocus 
                                        {...register("destination", {required: "this field is required"})}
                                    />
                                    {errors.destination && <div style={style}>{errors.destination.message}</div>}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        type="number"
                                        required
                                        id="price"
                                        label="price"
                                        autoComplete="price"
                                        size="small"
                                        {...register("price", {required: "this field is required"})}
                                    />
                                    {errors.price && <div style={style}>{errors.price.message}</div>}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="description"
                                        type="description"
                                        id="description"
                                        size="small"
                                        {...register("description", {required: "this field is required"})}
                                    />
                                    {errors.description && <div style={style}>{errors.description.message}</div>}
                                </Grid>

                                <Grid item xs={12}>
                                {imageState && (
                                    <img src={
                                        typeof imageState === "object"
                                        ? URL.createObjectURL(new Blob([imageState]))
                                        : imageState
                                        } 
                                        alt="Preview" width="300" 
                                    />
                                )}
                                <Button variant="contained" component="label">
                                    {imageState ? "replace image" : "add image"}
                                        <input
                                            type="file"
                                            name="actual_image"
                                            accept="image/*"
                                            onChange={(e: any) => {
                                                e.preventDefault();
                                                setImageState(e.target.files[0]);
                                                setImage(e.target.files[0]);
                                            }}
                                            hidden  
                                        />
                                </Button >
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        control={control}
                                        name="start_date"
                                        defaultValue={dayjs(startDate)}
                                        rules={{ required: true }}
                                        render={({field: {onChange, value}}) => (
                                            <LocalizationProvider 
                                                dateAdapter={AdapterDayjs}
                                                adapterLocale="fr"
                                            >
                                                <DatePicker 
                                                    label="select starting date"
                                                    value={value}
                                                    //hookForm value is updated by calling this onchange
                                                    onChange={(e) => onChange(e.format("YYYY-MM-DD"))}
                                                    renderInput={
                                                        (params) => <TextField required {...params}
                                                                        error={Boolean(errors)}
                                                                        helperText={errors && "This field is required"}/>
                                                    }
                                                />
                                            </LocalizationProvider>
                                        )}
                                    />
                                    
                                </Grid>
                                <Grid item xs={12} sm={6}>  
                                <Controller
                                        control={control}
                                        name="end_date"
                                        defaultValue={dayjs(endDate)}
                                        rules={{ required: true }}
                                        render={({field: {onChange, value}}) => (
                                            <LocalizationProvider 
                                                dateAdapter={AdapterDayjs}
                                                adapterLocale="fr"
                                            >
                                                <DatePicker 
                                                    label="select end date"
                                                    value={value}
                                                    //hookForm value is updated by calling this onchange
                                                    onChange={(e) => onChange(e.format("YYYY-MM-DD"))}
                                                    renderInput={
                                                        (params) => <TextField required {...params}
                                                        error={Boolean(errors)}
                                                        helperText={errors && "This field is required"}/>
                                                    }
                                                />
                                            </LocalizationProvider>
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>  
                                    <Button fullWidth onClick={props.handleClose}>Cancel</Button>
                                </Grid>
                                <Grid item xs={12} sm={6}>  
                                    <Button 
                                        variant="contained"
                                        type="submit"
                                        fullWidth
                                    >
                                        Submit
                                    </Button>
                                </Grid>
                            </Grid>
                        </FormControl>
                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default VacationForm;
