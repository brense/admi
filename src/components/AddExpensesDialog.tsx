import * as React from 'react';
import Dialog, { DialogContent, DialogActions } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import AutoComplete from '../lib/AutoComplete';
import { ChevronLeft, ChevronRight } from 'material-ui-icons';
import { BasicDialog } from '../lib/Dialogs';
import { FormLabel, FormControl, FormHelperText, FormControlLabel } from 'material-ui/Form';
import { InputLabel } from 'material-ui/Input';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import Switch from 'material-ui/Switch';
import FileUpload from '../lib/FileUpload';
import DatePicker from 'material-ui-pickers/DatePicker';
import ProjectStore from '../stores/ProjectStore';

const initialState = {
  open: false,
  project: { name: '', id: null },
  total: '',
  btw: '',
  description: '',
  date: new Date(),
  deductible: 'no',
  deductibleType: '',
  billable: false,
  files: []
};

class AddExpensesDialog extends BasicDialog {

  state = initialState;

  constructor(props: { title: string }) {
    super(props);

    this.save = this.save.bind(this);
  }

  handleChange = (name: string) => (event: { target: { value: string } }) => {
    let value = '';
    if (event.target) {
      value = event.target.value;
    } else if (typeof event === 'string') {
      value = event;
    }
    this.setState({
      [name]: value,
    });
  }

  handleDateChange = (date: {}) => {
    this.setState({ date: date });
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

  filterSuggestions = (inputValue: string | null) => {
    let count = 0;
    let items = ProjectStore.projects.filter((suggestion: { name: string }) => {
      const keep =
        (!inputValue || suggestion.name.toLowerCase().includes(inputValue.toLowerCase())) &&
        count < 5;
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
    const deductibleCostsLink = 'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk' +
    '/winst/inkomstenbelasting/inkomstenbelasting_voor_ondernemers/zakelijke_kosten/aftrek_van_kosten';

    return (
      <Dialog open={this.state.open} onClose={this.cancel}>
        <DialogContent style={{ minWidth: 383, paddingBottom: 0 }}>
          <Typography variant="headline" style={{ marginBottom: 12 }}>Onkosten opgeven</Typography>
          <form noValidate={true} autoComplete="off" style={{ display: 'flex', flexDirection: 'column' }}>
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
            <DatePicker
              value={this.state.date}
              onChange={this.handleDateChange}
              margin="normal"
              label="Datum"
              helperText="Waneer is de uitgave gedaan?"
              required={true}
              leftArrowIcon={<ChevronLeft />}
              rightArrowIcon={<ChevronRight />}
              format="D MMMM"
              autoOk={true}
              disableFuture={true}
              fullWidth={true}
              cancelLabel="Annuleren"
            />
            <TextField
              label="Omschrijving"
              required={true}
              onChange={this.handleChange('description')}
              value={this.state.description}
              margin="normal"
              multiline={true}
              rowsMax="4"
              fullWidth={true}
            />
            <TextField
              required={true}
              label="Totaal bedrag"
              helperText="Inclusief BTW"
              onChange={this.handleChange('total')}
              value={this.state.total}
              margin="normal"
              type="number"
              fullWidth={true}
            />
            <TextField
              required={true}
              label="BTW bedrag"
              onChange={this.handleChange('btw')}
              value={this.state.btw}
              margin="normal"
              type="number"
              fullWidth={true}
            />
            {this.state.project.id !== 'intern' && (
              <FormControl margin="normal" required={true}>
                <FormLabel>Declarabel</FormLabel>
                <FormHelperText>
                  Kunnen de kosten gedeclareerd worden aan de opdrachtgever?
                                </FormHelperText>
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.billable}
                      onChange={(event, checked) => this.setState({ billable: checked })}
                    />
                  }
                  label={this.state.billable ? 'Ja' : 'Nee'}
                />
              </FormControl>
            )}
            {(!this.state.billable || this.state.project.id === 'intern') && (
              <FormControl margin="normal" required={true}>
                <InputLabel>Aftrekbaar</InputLabel>
                <Select
                  value={this.state.deductible}
                  onChange={(event) => this.setState({ deductible: event.target.value })}
                >
                  <MenuItem value="no">Nee</MenuItem>
                  <MenuItem value="yes">Ja</MenuItem>
                  <MenuItem value="partial">Gedeeltelijk</MenuItem>
                </Select>
                <FormHelperText>
                  Zie eisen belastingdienst voor&nbsp;
                  <a href={deductibleCostsLink} target="_blank">aftrekbare uitgaven</a>
                </FormHelperText>
              </FormControl>
            )}
            {(!this.state.billable || this.state.project.id === 'intern') && this.state.deductible === 'partial' && (
              <FormControl margin="normal" required={true}>
                <InputLabel>Soort kosten</InputLabel>
                <Select
                  value={this.state.deductibleType}
                  onChange={(event) => this.setState({ deductibleType: event.target.value })}
                >
                  <MenuItem value="office">Werkruimte thuis</MenuItem>
                  <MenuItem value="food">Voedsel, drank, genotmiddelen</MenuItem>
                  <MenuItem value="representation">Representatie, congressen, seminars</MenuItem>
                  <MenuItem value="moving">Verhuizing of dubbele huisvesting</MenuItem>
                  <MenuItem value="car">Auto van de zaak</MenuItem>
                  <MenuItem value="car_private">Zakelijke kosten eigen auto</MenuItem>
                </Select>
              </FormControl>
            )}
            <FileUpload
              label="Betalingsbewijs"
              helperText="Het BTW bedrag moet zichtbaar zijn!"
              onChange={(files: {}[]) => { this.setState({ files: files }); }}
              accept="image/*, application/pdf"
              multiple={false}
              margin="normal"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.cancel}>Annuleren</Button>
          <Button onClick={this.save} color="primary">Toevoegen</Button>
        </DialogActions>
      </Dialog>
    );
  }

  private save() {
    const expenses = this.state;
    delete expenses.open;
    console.log(expenses);
    // TODO:
    this.setState(initialState);
    this.onSave.next();
    this.cancel();
  }

}

export default AddExpensesDialog;
