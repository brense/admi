import * as React from 'react';
import { observer } from 'mobx-react';
import HourStore from '../stores/HourStore';
import ProjectStore from '../stores/ProjectStore';
import { IconButton, Icon, AppBar, Toolbar, Typography } from 'material-ui';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import * as moment from 'moment';
import axios from 'axios';

@observer
class Hours extends React.Component {

  state = {
    selected: [] as string[]
  };

  constructor(props: {}) {
    super(props);

    this.toggleCheckbox = this.toggleCheckbox.bind(this);
  }

  componentDidMount() {
    axios.get('http://localhost:3001/api/hour').then((response: { data: {}[] }) => {
      HourStore.hours = response.data;
    });
    axios.get('http://localhost:3001/api/project').then((response: { data: {}[] }) => {
      ProjectStore.projects = response.data;
    });
  }

  toggleCheckbox(hour: { id: string }) {
    const index = this.state.selected.indexOf(hour.id);
    if (index >= 0) {
      this.state.selected.splice(index, 1);
      this.setState({ selected: this.state.selected });
    } else {
      this.setState({ selected: [...this.state.selected, hour.id] });
    }
  }

  toggleAll(hours: {}[]) {
    if (this.state.selected.length === hours.length) {
      this.setState({ selected: [] });
    } else {
      const ids: string[] = [];
      hours.forEach((hour: { id: string }) => {
        ids.push(hour.id);
      });
      this.setState({ selected: ids });
    }
  }

  deleteSelected(ids: string[]) {
    axios.delete('http://localhost:3001/api/hour?ids=' + ids.join()).then((response: {}) => {
      const newHours: {}[] = [];
      HourStore.hours.forEach((item: {id: string}) => {
        if (ids.indexOf(item.id) === -1) {
          newHours.push(item);
        }
      });
      HourStore.hours = newHours;
      this.setState({ selected: [] });
    });
  }

  render() {
    return (
      <div>
        <AppBar position="sticky" color={this.state.selected.length > 0 ? 'secondary' : 'default'}>
          <Toolbar style={{display: 'flex'}}>
            <Typography variant="headline" color="inherit" style={{flex: 1}}>Uren administratie</Typography>
            {this.state.selected.length > 0 && (
              <div>
                <Typography variant="subheading" color="inherit" style={{display: 'inline'}}>
                  {this.state.selected.length} Geselecteerd
                </Typography>
                <IconButton onClick={() => this.deleteSelected(this.state.selected)} color="inherit">
                  <Icon>delete</Icon>
                </IconButton>
              </div>
            )}
          </Toolbar>
        </AppBar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={this.state.selected.length > 0 && this.state.selected.length < HourStore.hours.length}
                  checked={this.state.selected.length > 0 && this.state.selected.length === HourStore.hours.length}
                  onChange={() => this.toggleAll(HourStore.hours)}
                />
              </TableCell>
              <TableCell>Datum</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Omschrijving</TableCell>
              <TableCell numeric={true}>Aantal uren</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {HourStore.hours
              .sort((a: { date: string }, b: { date: string }) => Date.parse(b.date) - Date.parse(a.date))
              .map((
                hour: {
                  id: string,
                  description: string,
                  project: string,
                  date: Date,
                  hours: number
                },
                i: number
              ) => (
                  <TableRow key={hour.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={this.state.selected.indexOf(hour.id) >= 0}
                        onClick={() => this.toggleCheckbox(hour)}
                      />
                    </TableCell>
                    <TableCell>{moment(new Date(hour.date)).format('D MMMM')}</TableCell>
                    <TableCell>{ProjectStore.findProject(hour.project).name}</TableCell>
                    <TableCell>{hour.description}</TableCell>
                    <TableCell numeric={true}>{hour.hours}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>

      </div>
    );
  }
}

export default Hours;
