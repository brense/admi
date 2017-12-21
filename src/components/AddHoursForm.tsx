import * as React from 'react';
//import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import AutoComplete from './AutoComplete';
const DatePicker = require('material-ui-pickers').DatePicker;
import { ChevronLeft, ChevronRight } from 'material-ui-icons';

class AddHoursForm extends React.Component {

    state = {
        project: '',
        hours: '',
        description: '',
        date: new Date()
    };

    handleChange = (name: string) => (event: any) => {
        let value = '';
        if(event.target){
            value = event.target.value;
        } else if(typeof event === 'string'){
            value = event;
        }
        console.log(name, value);
        this.setState({
            [name]: value,
        });
    };

    handleDateChange = (date: any) => {
        this.setState({ date: date })
    }

    render() {
        const projects = [
            { label: 'A Test project 1' },
            { label: 'B Test project 2' }
        ];
        return (
            <form noValidate autoComplete="off" style={{display: 'flex', flexDirection: 'column'}}>
                <AutoComplete
                    suggestions={projects}
                    label="Project"
                    placeholder="Zoek een project..."
                    margin="normal"
                    onChange={this.handleChange('project')}
                    value={this.state.project}
                    required
                />
                <DatePicker
                    value={this.state.date}
                    onChange={this.handleDateChange}
                    margin="normal"
                    label="Datum"
                    required
                    leftArrowIcon={<ChevronLeft />}
                    rightArrowIcon={<ChevronRight />}
                    format="D MMMM"
                    autoOk
                    disableFuture
                />
                <TextField
                    required
                    label="Aantal uren"
                    onChange={this.handleChange('hours')}
                    value={this.state.hours}
                    margin="normal"
                    type="number"
                />
                <TextField
                    label="Omschrijving"
                    required
                    onChange={this.handleChange('description')}
                    value={this.state.description}
                    margin="normal"
                    multiline
                    rowsMax="4"
                />
            </form>
        );
    }
}

export default AddHoursForm;
