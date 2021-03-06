import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera, Permissions } from 'expo';
import { Ionicons } from '@expo/vector-icons'
import { Header } from 'react-native-elements'
import { GOOGLEVISIONAPI, SPOONACULARAPI } from '../config/index.js'
import axios from 'axios'
import Frisbee from 'frisbee'
import * as Progress from 'react-native-progress';

export default class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    isLoading: false,
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Header
            outerContainerStyles={{ backgroundColor: '#ffffff' }}
            rightComponent={{ icon: 'keyboard-arrow-right', color: 'black', onPress: () => this.props.navigation.navigate('Home') }}
            centerComponent={{ text: "Camera", style: { color: 'black' } }} />
          <Camera ref={ref => { this.camera = ref }} style={{ flex: 1 }} type={this.state.type}>
            {this.state.isLoading && <Progress.CircleSnail animated={true} thickness={10} size={250} style={{ position: "absolute", bottom: 200, alignSelf: "center" }}></Progress.CircleSnail>}
            <View style={{ position: "absolute", bottom: 35, alignSelf: "center" }}>
              <TouchableOpacity
               onPress={this.takePicture}
                // onPress={(this.takePicture, () => {
                //   this.setState({isLoading: true})})}
                style={{ alignSelf: 'center' }}
                >
                <Ionicons name="ios-radio-button-on" size={70} color="white" />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
  
//  setIsLoading = () => {
//    this.setState({isLoading: true})

//   }

  takePicture = () => {
    if (this.camera) {
      const options = {base64: true};
      this.setState({isLoading: true})
      console.log(this.state.isLoading)
    this.camera.takePictureAsync(options)
    .then(data => {
      console.log(this.state.isLoading)
        this.analyseRecipe(data.base64)
        })
      }
  }

  
  extractServings = ingredientList => {
    const regex = /(serv)|(yield)|(portion)/i;
    const servingsIndex = ingredientList.findIndex(textLine => {
      return regex.test(textLine)
    })
    const servings = ingredientList[servingsIndex].match(/\d+/)
    return servings[0]
  }

  analyseRecipe = fileName => {
    const visionRequest = {
      requests: [
        {
          image: {
            content: fileName,
          },
          features: [
            {
              "type": 'TEXT_DETECTION'
            }
          ]
        }]
    }
    return axios.post(`https://vision.googleapis.com/v1/images:annotate?key=${GOOGLEVISIONAPI}`, visionRequest)
      .then(results => {
        console.log("Google Vision Responding")
        // const recipeText = results.data.responses[0].textAnnotations[0].description;
        // const ingredientList = recipeText.split("\n")
        const ingredientList = ['Grandmas Stuffed Zucchini', 'yeild: 4 Servings', 'Cook Time: 20 mins', 'Ingredients', '2 Zucchini', '1 small onion']
        const serves = this.extractServings(ingredientList)
        const ingredients = ingredientList.slice(ingredientList.indexOf('Ingredients') + 1)
        this.parseIngredients(ingredients, serves, ingredientList[0])
      })
      .catch(err => {
        console.error('ERROR:', err);
      });
  }

  parseIngredients = (ingredients, serves, title) => {
    const api = new Frisbee({
      baseURI: "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/parseIngredients",
      headers: {
        "X-Mashape-Key": SPOONACULARAPI,
        "X-Mashape-Host": "spoonacular-recipe-food-nutrition-v1.p.mashape.com",
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    Promise.all(ingredients.map((ingredient) => {
      console.log(`Parsing>>>>>${ingredient}`)
      return api.post(`?ingredientList=${ingredient}&servings=${serves}`)
    })
    )
      .then(response => this.addNewRecipe(response, title, serves)
      )
      .catch(err => {
        console.error('ERROR2:', Object.entries(err));
      })
  }

  addNewRecipe = (ingredients, title, servings) => {
    const api = new Frisbee({
      headers: {
        "Content-Type": 'application/json',
        "Accept": 'application/json'
      }
    });

    const ingredientList = ingredients.map(ingredient => {
      return {
        foodType: ingredient.body[0].aisle,
        name: ingredient.body[0].name,
        amount: ingredient.body[0].amount,
        units: ingredient.body[0].unit,
        price: ingredient.body[0].estimatedCost.value,
      }
    });

    const request = {
      name: title,
      servings,
      ingredients: ingredientList,
    }

    console.log(request, "<<<<<<<<<<<<<<<<");
    // TODO: change this to add props
    api.post(`https://scranner123.herokuapp.com/api/recipes/5bdc70fed1830c1a584407ac`, { body: request })
      .then(response => console.log(response));
  }

}
