import * as React from 'react';
import { observer } from 'mobx-react';
import { ListItemText, ListItemIcon } from 'material-ui/List';
import { Check, Close, MoreVert, Settings } from 'material-ui-icons';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import Menu, { MenuItem } from 'material-ui/Menu';
import Divider from 'material-ui/Divider/Divider';
import Icon from 'material-ui/Icon';
import ActionStore, { ActionItem } from '../stores/ActionStore';

@observer
class ActionMenu extends React.Component {

  state = {
    anchorEl: undefined,
    editActions: false
  };

  openMenu = (event: { currentTarget: {} }) => {
    this.setState({ anchorEl: event.currentTarget });
  }

  closeMenu = (item?: ActionItem) => (event?: {}) => {
    this.setState({ anchorEl: undefined });
    if (item && item.action) {
      ActionStore.doAction(item.action);
    }
  }

  toggleEditActions = () => {
    this.setState({ editActions: !this.state.editActions });
    if (this.state.editActions) {
      this.closeMenu()();
      // TODO: save editted actions...
    }
  }

  render() {
    const { anchorEl } = this.state;

    return (
      <div>
        {ActionStore.actions
          .filter((item: ActionItem) => { return item.quick; })
          .map((item: ActionItem, i: number) => {
            return (
              <Tooltip key={i} title={item.title}>
                <IconButton onClick={() => ActionStore.doAction(item.action)}><Icon>{item.icon}</Icon></IconButton>
              </Tooltip>
            );
          })
        }
        <IconButton onClick={this.openMenu}>
          <MoreVert />
        </IconButton>
        <Menu
          anchorEl={this.state.anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.closeMenu()}
          transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        >
          {ActionStore.actions
            .filter((item: ActionItem) => { return !item.quick || this.state.editActions; })
            .map((item: ActionItem, i: number) => {
              return (
                <MenuItem
                  key={i}
                  onClick={() => { this.state.editActions ? (item.quick = !item.quick) : this.closeMenu(item)(); }}
                >
                  <ListItemIcon>
                    {this.state.editActions ?
                      <Icon color={item.quick ? 'primary' : 'inherit'}><Check /></Icon> :
                      <Icon>{item.icon}</Icon>
                    }
                  </ListItemIcon>
                  <ListItemText inset={true} primary={item.title} />
                </MenuItem>
              );
            })
          }
          <Divider />
          <MenuItem onClick={this.toggleEditActions} dense={true}>
            <ListItemIcon>
              {this.state.editActions ? <Close /> : <Settings />}
            </ListItemIcon>
            <ListItemText
              inset={true}
              primary={this.state.editActions ? 'Klaar met aanpassen' : 'Snelle acties aanpassen'}
            />
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

export default ActionMenu;
