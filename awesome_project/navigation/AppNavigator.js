import React from 'react';
import { createSwitchNavigator } from 'react-navigation';

import LowerNav from './LowerNav';

export default createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: LowerNav,
});