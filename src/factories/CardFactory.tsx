import * as React from 'react';
import Button from 'material-ui/Button';
import Card, { CardHeader, CardActions } from 'material-ui/Card';
import List, { ListItem, ListItemText, ListItemIcon } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import { MoreVert, Comment, Archive, Check, Close } from 'material-ui-icons';
import IconButton from 'material-ui/IconButton';
import { blue, grey, green, pink } from 'material-ui/colors';

interface CardProps {
  author?: { name: string, image: string };
  date?: {};
  background?: string;
  color?: string;
  actions?: {}[];
  title?: string;
  noArchive?: boolean;
}

const CardFactory = {
  alertCard(props: CardProps) {
    return (
      <BasicCard
        {...props}
        background={pink.A400}
        color="#fff"
      />
    );
  },
  actionCard(props: CardProps) {
    return (
      <BasicCard
        {...props}
        background={blue.A700}
        color="#fff"
      />
    );
  },
  confirmCard(props: CardProps) {
    return (
      <BasicCard
        {...props}
        background={blue.A700}
        color="#fff"
        noArchive={true}
        actions={[
          <Button variant="raised" style={{ background: green.A700, color: '#fff' }} key={1}>
            <Check />&nbsp;&nbsp;Ok
          </Button>,
          <Button variant="raised" style={{ background: pink.A400, color: '#fff' }} key={0}>
            <Close />&nbsp;&nbsp;Annuleren
          </Button>
        ]}
      />
    );
  }
};

export const AlertCard = CardFactory.alertCard;
export const ActionCard = CardFactory.actionCard;
export const ConfirmCard = CardFactory.confirmCard;

export default class BasicCard extends React.Component<CardProps> {

  private headerProps: {} = {};
  private cardProps: {} = {};

  constructor(props: CardProps) {
    super(props);

    if (props.title) {
      this.headerProps = {
        title: <span {...props.color && { style: { color: props.color } }}>{props.title}</span>
      };
    } else if (props.author && props.date) {
      this.headerProps = {
        avatar: <Avatar alt={props.author.name} src={props.author.image} />,
        title: <span {...props.color && { style: { color: props.color } }}>{props.author.name}</span>,
        subheader: <span {...props.color && { style: { color: props.color } }}>{props.date}</span>
      };
    } else {
      this.headerProps = {
        subheader: <span {...props.color && { style: { color: props.color } }}>{props.date}</span>
      };
    }

    if (props.background && props.color) {
      this.cardProps = {
        style: { background: props.background, color: props.color }
      };
    }
  }

  render() {
    return (
      <div className={'masonry-card'}>
        <Card elevation={1} {...this.cardProps}>
          <CardHeader {...this.headerProps} action={this.renderCardMenu()} />
          {this.props.children}
          <CardActions>
            {this.props.actions}
            {!this.props.noArchive && <Button color="inherit"><Archive />&nbsp;&nbsp;Gelezen</Button>}
          </CardActions>
          {this.props.author && (<List style={{ background: grey[100], padding: 0 }}>
            <Divider />
            <ListItem button={true} dense={true} component="a" href="#simple-list">
              <Avatar alt="Remy Sharp" src="https://picsum.photos/64/64/?random" />
              <ListItemText primary="Rense Bakker" secondary="Lorem ipsum dolor sit ahmed." />
            </ListItem>
            <Divider />
            <ListItem button={true} dense={true} component="a" href="#simple-list">
              <ListItemIcon>
                <Comment />
              </ListItemIcon>
              <ListItemText primary="Reageren" />
            </ListItem>
          </List>)}
        </Card>
      </div>
    );
  }

  private renderCardMenu() {
    return (
      <IconButton color="inherit">
        <MoreVert />
      </IconButton>
    );
  }
}
