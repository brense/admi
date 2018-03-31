import * as React from 'react';
import Masonry from 'react-masonry-component';
import { Card, Typography, Avatar, Button, Checkbox } from 'material-ui';
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import { CardContent } from 'material-ui/Card';
import { Schedule } from 'material-ui-icons';
import BasicCard, { ConfirmCard, AlertCard, ActionCard } from '../factories/CardFactory';
import ActionMenu from '../components/ActionMenu';

class Dashboard extends React.Component {

  render() {
    return (
      <div className={'masonry-feed'}>
        <Masonry options={{ columnWidth: '.grid-sizer', gutter: 0 }}>
          <div className={'grid-sizer'} />
          <div className={'masonry-card'}>
            <Card elevation={1}>
              <List style={{ padding: 0 }}>
                <ListItem button={true} component="a" href="#simple-list">
                  <Avatar alt="Remy Sharp" src="https://picsum.photos/64/64/?random" />
                  <ListItemText primary="Wat wil je doen?" />
                  <ListItemSecondaryAction>
                    <ActionMenu />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Card>
          </div>
          <ActionCard
            date="Donderdag 7 December"
            title="Schrijf je uren voor vandaag!"
            actions={[
              <Button variant="raised" color="secondary" key={0}>
                <Schedule />&nbsp;&nbsp;Uren invullen
            </Button>
            ]}
          >
            <CardContent>
              <Typography variant="body1" color="inherit">Vul nu je uren in zodat je niets vergeet.</Typography>
            </CardContent>
          </ActionCard>
          <ConfirmCard date="September 15, 2017">
            <CardContent>
              <Typography variant="body1" color="inherit">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse et lobortis justo.
                Quisque feugiat elit sit amet nibh rutrum condimentum.
                Mauris ullamcorper, elit eu luctus rutrum, sem nisi consectetur velit, quis mattis enim purus nec felis.
              </Typography>
            </CardContent>
          </ConfirmCard>
          <BasicCard
            date="September 15, 2017"
            title="Jouw uren vandaag"
            actions={[
              <Button variant="raised" color="primary" key={0}>
                <Schedule />&nbsp;&nbsp;Uren toevoegen
              </Button>
            ]}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                  <TableCell>Naam</TableCell>
                  <TableCell>E-mail</TableCell>
                  <TableCell numeric={true}>Uren</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover={true}>
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                  <TableCell>Rense Bakker</TableCell>
                  <TableCell>b.rense@gmail.com</TableCell>
                  <TableCell numeric={true}>24</TableCell>
                </TableRow>
                <TableRow hover={true}>
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                  <TableCell>José Kooi</TableCell>
                  <TableCell>jose@floodcom.nl</TableCell>
                  <TableCell numeric={true}>18</TableCell>
                </TableRow>
                <TableRow hover={true}>
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                  <TableCell>Nikéh Booister</TableCell>
                  <TableCell>nikeh@floodcom.nl</TableCell>
                  <TableCell numeric={true}>12</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </BasicCard>
          <AlertCard date="September 15, 2017">
            <CardContent>
              <Typography variant="body1" color="inherit">
                Ut quis turpis eros. Etiam dapibus orci vel odio lacinia, a rutrum magna consectetur.
                Fusce consequat ultrices tortor, id placerat enim bibendum ut.
                Suspendisse finibus dolor dictum ex ultricies, quis placerat sapien faucibus.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Typography>
            </CardContent>
          </AlertCard>
          <BasicCard
            date="August 14, 2016"
            author={{ name: 'Nikéh Booister', image: 'https://picsum.photos/72/72/?random' }}
          >
            <CardContent>
              <Typography variant="body1" color="inherit">
                Cras mattis diam tellus, in pellentesque ipsum aliquam non.
                Nam nec velit ac ligula viverra malesuada. Aenean non feugiat risus, et vehicula sem.
                Curabitur vitae orci tempus, malesuada nunc sit amet, cursus augue.
                Nullam eu velit vitae eros fringilla dapibus sed non dolor. Donec sed lorem eu arcu imperdiet malesuada.
                Suspendisse gravida maximus mattis. Sed ultrices sit amet ante id feugiat.
              </Typography>
            </CardContent>
          </BasicCard>
        </Masonry>
      </div>
    );
  }
}

export default Dashboard;
