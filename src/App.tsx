import * as React from 'react';
import './App.css';
import { withRouter } from 'react-router-dom'
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Badge from 'material-ui/Badge';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { Dashboard, Work, NoteAdd, Schedule, AccountBalance, EuroSymbol, Group, Description, ContactPhone, PowerSettingsNew, Settings, HelpOutline } from 'material-ui-icons';
import { Logout } from './Auth';

class App extends React.Component<{ history?: any, location?: any }> {

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
  }

  render() {
    return (
      <div className="App">
        {this.renderDrawer()}
        <main>{this.props.children}</main>
      </div>
    );
  }

  private renderDrawer() {
    return (
      <Drawer type="permanent" className="drawer" >
        <AppBar position="static" color="primary" elevation={0}>
          <Toolbar>
            <Typography type="headline" color="inherit">FloodCom</Typography>
          </Toolbar>
        </AppBar>
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
