import * as React from 'react';
import { observer } from 'mobx-react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Drawer, AppBar, Toolbar, Typography } from 'material-ui';
import List, { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, ListSubheader } from 'material-ui/List';
import { Avatar, Icon, Badge, Divider, IconButton } from 'material-ui';
import { Logout } from '../lib/Auth';
import ActionStore from '../stores/ActionStore';

interface NavigationItemProps {
  icon: {};
  title: string;
  path: string;
}

interface ActionItemProps extends NavigationItemProps {
  action?: string;
  quick?: boolean;
  sidebar?: boolean;
}

@observer
class Sidebar extends React.Component<RouteComponentProps<{}>> {

  private navigationItems = [
    {
      icon: 'account_balance',
      title: 'Inkomsten en uitgaven',
      path: '/finances'
    },
    {
      icon: 'work',
      title: 'Projecten en opdrachten',
      path: '/projects'
    },
    {
      icon: 'description',
      title: 'Facturen en offertes',
      path: '/invoices'
    },
    {
      icon: 'contact_phone',
      title: 'Klanten en contacten',
      path: '/contacts'
    },
    {
      icon: 'group',
      title: 'Medewerkers',
      path: '/employees'
    }
  ];

  private history: {
    location: { pathname: string },
    push: (path: string, state?: {}) => void
  };

  constructor(props: RouteComponentProps<{}>) {
    super(props);
    this.history = props.history;
  }

  render() {
    const textOverflowStyles = {
      display: 'block',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      color: '#fff'
    } as React.CSSProperties;

    return (
      <Drawer variant="permanent" className="drawer">
        <AppBar position="sticky">
          <Toolbar style={{display: 'flex', paddingRight: 4}}>
            <Typography variant="title" color="inherit" style={{flex: 1}}>
              FloodCom
            </Typography>
            <IconButton onClick={() => this.goTo('/settings')}>
              <Icon style={{ color: '#fff' }}>settings</Icon>
            </IconButton>
            <Logout><IconButton>
              <Icon style={{ color: '#fff' }}>power_settings_new</Icon>
            </IconButton></Logout>
          </Toolbar>
          <List style={{padding: 0}}>
            <ListItem
              button={true}
              onClick={() => this.goTo('/')}
              {...this.isActive('/') ? { className: 'active' } : {}}
            >
              <Badge badgeContent={4} color="secondary">
                <Avatar
                  alt="Remy Sharp"
                  src="https://picsum.photos/64/64/?random"
                />
              </Badge>
              <ListItemText
                color="inherit"
                primary={<span style={textOverflowStyles}>Rense Bakker Schulz Verhagen</span>}
                secondary={<span style={textOverflowStyles}>rense@floodcom.nl</span>}
              />
              <ListItemSecondaryAction>
                <IconButton onClick={() => this.goTo('/profile')} color="inherit">
                  <Icon>create</Icon>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </AppBar>
        <List>
          {ActionStore.actions
            .filter((item: ActionItemProps) => item.sidebar)
            .map((item: ActionItemProps, i: number) => this.renderActionItem(item, i))
          }
          <Divider />
        </List>
        <List subheader={<ListSubheader>Overzichten</ListSubheader>} className="navigation" dense={true}>
          {this.navigationItems
            .map((item: NavigationItemProps, i: number) => this.renderNavigationItem(item, i))
          }
        </List>
        <List dense={true}>
          <ListItem
            button={true}
            onClick={() => this.goTo('/help')}
            {...this.isActive('/help') ? { className: 'active' } : {}}
          >
            <ListItemIcon>
              <Icon>help_outline</Icon>
            </ListItemIcon>
            <ListItemText primary="Hulp en feedback" />
          </ListItem>
        </List>
      </Drawer>
    );
  }

  private renderActionItem(item: ActionItemProps, i: number) {
    return (
      <ListItem
        key={i}
        button={true}
        onClick={() => this.goTo(item.path)}
        {...this.isActive(item.path) ? { className: 'active' } : {}}
      >
        <ListItemIcon>
          <Icon>{item.icon}</Icon>
        </ListItemIcon>
        <ListItemText primary={item.title} />
        {item.action && <ListItemSecondaryAction>
          <IconButton color="primary" onClick={() => ActionStore.doAction(item.action)}>
            <Icon>add_circle</Icon>
          </IconButton>
        </ListItemSecondaryAction>}
      </ListItem>
    );
  }

  private renderNavigationItem(item: NavigationItemProps, i: number) {
    return (
      <ListItem
        key={i}
        button={true}
        onClick={() => this.goTo(item.path)}
        {...this.isActive(item.path) ? { className: 'active' } : {}}
      >
        <ListItemIcon>
          <Icon>{item.icon}</Icon>
        </ListItemIcon>
        <ListItemText primary={item.title} />
      </ListItem>
    );
  }

  private isActive(path: string) {
    return (this.history.location || { pathname: '' }).pathname === path;
  }

  private goTo(path: string) {
    this.history.push(path);
  }
}

export default withRouter(Sidebar);
