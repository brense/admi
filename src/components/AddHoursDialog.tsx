import * as React from 'react';
import { Button, Icon, Typography, TextField } from 'material-ui';
import Dialog, { DialogContent, DialogActions } from 'material-ui/Dialog';
import DatePicker from 'material-ui-pickers/DatePicker';
import AutoComplete from '../lib/AutoComplete';
import { BasicDialog } from '../lib/Dialogs';
import Validate, { FormValidate } from '../lib/Validate';
import HourStore from '../stores/HourStore';
import ProjectStore from '../stores/ProjectStore';
import axios from 'axios';

import * as moment from 'moment';
import 'moment/locale/nl';
moment.locale('nl');

const initialState = {
  open: false,
  isValid: false,
  project: { name: '', id: null },
  hours: null,
  description: '',
  date: moment(new Date())
};

class AddHoursDialog extends BasicDialog {

  state = initialState;

  constructor(props: { title: string }) {
    super(props);

    this.save = this.save.bind(this);
  }

  componentDidMount() {
    axios.get('http://localhost:3001/api/project').then((response: { data: {}[]}) => {
      ProjectStore.projects = response.data;
    });
  }

  handleChange = (name: string) => (event: { target: { value: string } }) => {
    let value = '';
    if (event && event.target) {
      value = event.target.value;
    } else if (typeof event === 'string') {
      value = event;
    }
    this.setState({
      [name]: value,
    });
  }

  handleProjectChange = (project: { name: string }) => {
    if (!project) {
      this.setState({ project: { name: '' } });
      return;
    }
    if (project.name) {
      this.setState({ project: project });
    }
  }

  handleDateChange = (date: {}) => {
    this.setState({ date: date });
  }

  filterSuggestions = (inputValue: string | null) => {
    let count = 0;
    let items = ProjectStore.projects.filter((suggestion: { name: string }) => {
      const keep =
        (!inputValue || suggestion.name.toLowerCase().includes(inputValue.toLowerCase())) &&
        count < 4;
      if (keep) {
        count += 1;
      }
      return keep;
    });
    if (inputValue) {
      items.push({ name: inputValue });
    }
    return items;
  }

  render() {
    return (
      <Dialog open={this.state.open} onClose={this.cancel}>
        <DialogContent style={{ minWidth: 383 }}>
          <Typography variant="headline" style={{ marginBottom: 12 }}>Uren schrijven</Typography>
          <FormValidate
            autoComplete="off"
            style={{ display: 'flex', flexDirection: 'column' }}
            onChange={(isValid) => { this.setState({ isValid: isValid }); }}
          >
            <Validate required={true} errorMessage="Geef een geldige projectnaam op">
              <AutoComplete
                suggestions={ProjectStore.projects}
                label="Project"
                placeholder="Zoek een project..."
                margin="normal"
                onChange={this.handleProjectChange}
                value={this.state.project.name}
                itemToString={(item: { name: string }) => item && item.name}
                createNew={(suggestion: { id: string }) => !suggestion.id && 'Create new: '}
                filter={this.filterSuggestions}
                required={true}
                fullWidth={true}
              />
            </Validate>
            <Validate required={true} errorMessage="Geef een geldige datum op">
              <DatePicker
                value={this.state.date}
                onChange={this.handleDateChange}
                margin="normal"
                label="Datum"
                required={true}
                leftArrowIcon={<Icon>chevron_left</Icon>}
                rightArrowIcon={<Icon>chevron_right</Icon>}
                format="D MMMM"
                autoOk={true}
                disableFuture={true}
                fullWidth={true}
                cancelLabel="Annuleren"
              />
            </Validate>
            <Validate required={true} errorMessage="Geef een omschrijving">
              <TextField
                label="Omschrijving"
                onChange={this.handleChange('description')}
                value={this.state.description}
                margin="normal"
                multiline={true}
                rowsMax="4"
                fullWidth={true}
              />
            </Validate>
            <Validate required={true} errorMessage="Vul het aantal uren in">
              <TextField
                label="Aantal uren"
                onChange={this.handleChange('hours')}
                value={this.state.hours || ''}
                margin="normal"
                type="number"
                fullWidth={true}
              />
            </Validate>
          </FormValidate>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { this.cancel(); this.setState(initialState); }}>Annuleren</Button>
          <Button onClick={this.save} color="primary" disabled={!this.state.isValid}>Toevoegen</Button>
        </DialogActions>
      </Dialog>
    );
  }

  private save() {
    let projectId: string | null = this.state.project.id;
    new Promise((resolve: () => void, reject: () => void) => {
      if (!projectId) {
        axios.post('http://localhost:3001/api/project', this.state.project)
          .then((response: { data: { id: string } }) => {
            projectId = response.data.id;
            ProjectStore.projects.push(response.data);
            resolve();
          });
      } else {
        resolve();
      }
    }).then(() => {
      const { open, isValid, ...cleanState } = this.state;
      const hours = {
        ...cleanState,
        date: this.state.date.toDate().toString(),
        project: projectId
      };
      axios.post('http://localhost:3001/api/hour', hours).then((response: { data: {} }) => {
        HourStore.hours.push(response.data);
      });
      this.setState(initialState);
      this.onSave.next();
      this.cancel();
    });
  }

}

export default AddHoursDialog;
