import React from "react";
import { Text, View, ScrollView, Button, Image } from "react-native"
import { Header, CheckBox } from 'react-native-elements'
export default class BasketPage extends React.Component {
  static navigationOptions = {
    tabBarLabel: "Basket"
  }
  state = {
    checked: false,
    shoppingList: [
      {
        recipes: [
          {
            "_id": "5bd73ddfbf9a0930d7f77b19",
            "name": "Spaghetti bolognese",
            "user": "5bd73ddfbf9a0930d7f77b15",
            "servings": 2,
            "ingredients": [
              {
                "_id": "5bd73ddfbf9a0930d7f77b1f",
                "name": "Spaghetti",
                "amount": "200",
                "units": "g"
              },
              {
                "_id": "5bd73ddfbf9a0930d7f77b1e",
                "name": "Mushrooms",
                "amount": "80",
                "units": "g"
              },
              {
                "_id": "5bd73ddfbf9a0930d7f77b1d",
                "name": "Beef Mince",
                "amount": "250",
                "units": "g"
              },
              {
                "_id": "5bd73ddfbf9a0930d7f77b1c",
                "name": "Onion",
                "amount": "1",
                "units": "onion"
              },
              {
                "_id": "5bd73ddfbf9a0930d7f77b1b",
                "name": "Chopped Tomatoes"
              },
              {
                "_id": "5bd73ddfbf9a0930d7f77b1a",
                "name": "Garlic paste",
                "amount": "15",
                "units": "g"
              }
            ],
            "__v": 0
          }
        ],
        _id: "5bd73ddfbf9a0930d7f77b22",
        user: {
          "_id": "5bd73ddfbf9a0930d7f77b15",
          "username": "emmajarvis",
          "firstName": "Emma",
          "lastName": "Jarvis",
          "email": "emmajarvis@gmail.com",
          "__v": 0
        },
        ingredients: [
          {
            _id: "5bd73ddfbf9a0930d7f77b28",
            name: "Spaghetti",
            amount: "200",
            units: "g"
          },
          {
            _id: "5bd73ddfbf9a0930d7f77b27",
            name: "Mushrooms",
            amount: "80",
            units: "g"
          },
          {
            _id: "5bd73ddfbf9a0930d7f77b26",
            name: "Beef Mince",
            amount: "250",
            units: "g"
          },
          {
            _id: "5bd73ddfbf9a0930d7f77b25",
            name: "Onion",
            amount: "1",
            units: "onion"
          },
          {
            _id: "5bd73ddfbf9a0930d7f77b24",
            name: "Chopped Tomatoes",
            amount: "1",
            units: "tin"
          },
          {
            _id: "5bd73ddfbf9a0930d7f77b23",
            name: "Garlic paste",
            amount: "15",
            units: "g"
          }
        ],
        "__v": 0
      }
    ]
  }
  render() {
    return (
      <View>
        <Header
          outerContainerStyles={{ backgroundColor: '#ffffff' }}
          leftComponent={{ icon: 'camera-alt', color: 'black', onPress: () => this.props.navigation.navigate('Camera') }}
          centerComponent={{ text: "Basket", style: { color: 'black' } }}
          rightComponent={{ icon: 'face', color: 'black', onPress: () => this.props.navigation.navigate('User') }} />
        <View>
          <Text> You have {this.state.shoppingList.map(shopping => {
            return shopping.ingredients.length
          })} items left to buy</Text>
        </View>
        <ScrollView>{this.state.shoppingList.map(shopping => {
          return (shopping.ingredients.map(ingredient => {
            return (<View key={ingredient._id}><CheckBox title={ingredient.name}
              checked={this.state.checked} onPress={() => this.setState({ checked: !this.state.checked })} /></View>)
          }))
        })}</ScrollView>
      </View>
    )
  }
}