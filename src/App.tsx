import * as React from 'react';
import './App.css';
import { withRouter } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Badge from 'material-ui/Badge';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import { Add, Dashboard, Work, NoteAdd, Schedule, AccountBalance, EuroSymbol, Group, Description, ContactPhone, PowerSettingsNew, Settings, HelpOutline } from 'material-ui-icons';
import { Logout } from './Auth';
import BasicDialog from './factories/DialogFactory';
import Stepper, { Step, StepLabel, StepContent } from 'material-ui/Stepper';
import { DialogActions } from 'material-ui/Dialog';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormControl, FormControlLabel } from 'material-ui/Form';
import AddHoursForm from './components/AddHoursForm';

class App extends React.Component<{ history?: any, location?: any }> {

  state = {
    activeStep: 0,
    type: ''
  };

  private actionDialogRef: BasicDialog | null;

  private actionItems = [
    {
      icon: <Schedule />,
      title: 'Uren schrijven',
      path: '/hours'
    },
    {
      icon: <NoteAdd />,
      title: 'Factuur maken',
      path: '/invoice'
    }
  ];

  private navigationItems = [
    {
      icon: <AccountBalance />,
      title: 'Inkomsten en uitgaven',
      path: '/finances'
    },
    {
      icon: <Work />,
      title: 'Projecten en opdrachten',
      path: '/projects'
    },
    {
      icon: <Description />,
      title: 'Facturen en offertes',
      path: '/invoices'
    },
    {
      icon: <ContactPhone />,
      title: 'Klanten en contacten',
      path: '/contacts'
    },
    {
      icon: <Group />,
      title: 'Medewerkers',
      path: '/employees'
    },
    {
      icon: <EuroSymbol />,
      title: 'Belastingaangifte',
      path: '/tax'
    }
  ];

  constructor(props: any) {
    super(props);

    this.openActionDialog = this.openActionDialog.bind(this);
  }

  render() {
    return (
      <div className="App">
        {this.renderDrawer()}
        <main>{this.props.children}</main>
        <BasicDialog
          title="Uren schrijven"
          ref={(d) => { this.actionDialogRef = d; }}
        >
          <Stepper activeStep={this.state.activeStep} orientation="vertical">
            <Step>
              <StepLabel>Wat wil je doen?</StepLabel>
              <StepContent>
                <FormControl component="fieldset" required>
                  <RadioGroup
                    aria-label="Keuze"
                    name="type"
                    value={this.state.type}
                    onChange={this.handleChange}
                  >
                    <FormControlLabel value="hours" control={<Radio />} label="Uren schrijven" />
                    <FormControlLabel value="expenses" control={<Radio />} label="Onkosten opgeven" />
                    <FormControlLabel value="invoice" control={<Radio />} label="Factuur maken" />
                    <FormControlLabel value="project" control={<Radio />} label="Project toevoegen" />
                    <FormControlLabel value="contact" control={<Radio />} label="Klant toevoegen" />
                  </RadioGroup>
                </FormControl>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>{
                !this.state.type && 'Maak een keuze' ||
                (this.state.type === 'hours' && 'Uren schrijven') ||
                (this.state.type === 'expenses' && 'Onkosten opgeven') ||
                (this.state.type === 'invoice' && 'Factuur maken') ||
                (this.state.type === 'project' && 'Project toevoegen') ||
                (this.state.type === 'contact' && 'Klant toevoegen')
              }</StepLabel>
              <StepContent>{
                (this.state.type === 'hours' && <AddHoursForm />) ||
                (this.state.type === 'expenses' && 'Onkosten opgeven') ||
                (this.state.type === 'invoice' && 'Factuur maken') ||
                (this.state.type === 'project' && 'Project toevoegen') ||
                (this.state.type === 'contact' && 'Klant toevoegen')
              }</StepContent>
            </Step>
          </Stepper>
          <DialogActions>
            <Button
              disabled={this.state.activeStep === 0}
              onClick={this.handleBack}
            >
              Terug
                      </Button>
            <Button
              disabled={this.state.activeStep === 0 && !this.state.type}
              raised
              color="primary"
              onClick={this.handleNext}
            >
              {this.state.activeStep === 1 ? 'Voltooien' : 'Volgende'}
            </Button>
          </DialogActions>
        </BasicDialog>
        <Button onClick={this.openActionDialog} className="mainActionButton" fab color="accent" aria-label="edit">
          <Add />
        </Button>
      </div>
    );
  }

  private handleChange = (event:any, value:string) => {
    this.setState({type: value, activeStep: this.state.activeStep + 1 });
  };

  private handleNext = () => {
    this.setState({
      activeStep: this.state.activeStep + 1,
    });
  };

  private handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1,
    });
  };

  private openActionDialog() {
    if (this.actionDialogRef)
      this.actionDialogRef.open();
  }

  private renderDrawer() {
    return (
      <Drawer type="permanent" className="drawer">
        <List className="navigation">
          <ListItem button onClick={() => this.props.history.push('/profile')} {...this.props.location.pathname === '/profile' ? { className: 'active' } : {}}>
            <Avatar alt="Remy Sharp" src="https://picsum.photos/64/64/?random" />
            <ListItemText primary="Rense Bakker" secondary="rense@floodcom.nl" />
            <ListItemSecondaryAction>
              <Logout><IconButton><PowerSettingsNew /></IconButton></Logout>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem button dense onClick={() => this.props.history.push('/settings')} {...this.props.location.pathname === '/settings' ? { className: 'active' } : {}}>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Account instellingen" />
          </ListItem>
          <ListItem button onClick={() => this.props.history.push('/')} {...this.props.location.pathname === '/' ? { className: 'active' } : {}}>
            <ListItemIcon>
              <Badge badgeContent={4} color="accent">
                <Dashboard />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          {this.actionItems.map((item: any, i: number) => {
            return (
              <ListItem key={i} button onClick={() => this.props.history.push(item.path)} {...this.props.location.pathname === item.path ? { className: 'active' } : {}}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItem>
            );
          })}
          <Divider />
          {this.navigationItems.map((item: any, i: number) => {
            return (
              <ListItem key={i} button dense onClick={() => this.props.history.push(item.path)} {...this.props.location.pathname === item.path ? { className: 'active' } : {}}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItem>
            );
          })}
        </List>
        <List>
          <ListItem button dense onClick={() => this.props.history.push('/help')} {...this.props.location.pathname === '/help' ? { className: 'active' } : {}}>
            <ListItemIcon>
              <HelpOutline />
            </ListItemIcon>
            <ListItemText primary="Hulp en feedback" />
          </ListItem>
        </List>
      </Drawer>
    );
  }
}

export default withRouter(App);
