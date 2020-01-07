import 'date-fns';
import React from 'react';
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import {useDispatch, useSelector} from 'react-redux';

export default function DatePicker({type}) {
    const fromDate = useSelector(state => state.fromDate);
    const toDate = useSelector(state => state.toDate);
    const dispatch = useDispatch();

    const handleDateChange = (date) => {
        if(type === 'from'){
            dispatch({type: 'BANNER_START_DATE', fromDate: date});
        } else if(type === 'to'){
            dispatch({type: 'BANNER_END_DATE', toDate: date});
        }
    }

    return <MuiPickersUtilsProvider utils={MomentUtils}>
        <KeyboardDatePicker
          clearable
          margin="normal"
          id={`date-picker-dialog-${type}`}
          label={type === 'from' ? 'Start date' : type === 'to' ? 'End date' : ''}
          format="YYYY/MM/DD"
          value={type === 'from' ? fromDate : type === 'to' ? toDate : null}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
    </MuiPickersUtilsProvider>
}