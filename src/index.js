import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Cocktail extends React.Component {
    render() {
        let deleteIcon = '';
        if (this.props.isBasket) {
            deleteIcon = (
                <div onClick={this.props.deleteClickHandler} className="deleteCocktailIcon">
                    <i className="fas fa-times"/>
                </div>
            )
        }
        return (
            <div onClick={this.props.clickHandler} className="pic-container">
                <img className="image" src={this.props.cocktailData['strDrinkThumb']} alt=""/>
                {deleteIcon}
                <div className="middle">
                    <div className="pic-caption">
                        {this.props.cocktailData['strDrink']}
                    </div>
                </div>
                <hr/>
            </div>
        );
    }
}

class Ingredient extends React.Component {
    render() {
        let imgLink = "https://www.thecocktaildb.com/images/ingredients/" + this.props.ingredientData + "-Small.png";
        return (
            <li onClick={() => {this.props.clickHandler(this.props.ingredientData)}}>
                <img src={imgLink} alt=""/>{this.props.ingredientData}
                <hr/>
            </li>
        );
    }
}

class Cocktails extends React.Component {
    render() {
        return this.props.renderCocktailList(this.props.cocktails);
    }
}

class Basket extends React.Component {
    render() {
        return this.props.renderCocktailList(this.props.selectedCocktails);
    }
}

class Ingredients extends React.Component {
    inputEventHandlerIngredients = (e) => {
        if ('' === e.target.value) {
            this.setState(
                {
                    'ingredientList': this.state.originalIngredientList
                }
            )
        }
        this.setState(
            {
                'ingredientList': this.state.originalIngredientList.filter(ingredient => ingredient['strIngredient1'].includes(e.target.value))
            }
        )
    };

    renderIngredient(i) {
        return <Ingredient clickHandler={this.props.handleIngredientClick} key={i.replace(/\s/g, '_').toLowerCase()} ingredientData={i}/>;
    }


    componentDidMount() {
        fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState(
                        {
                            'ingredientList': result['drinks'],
                            'originalIngredientList': result['drinks']
                        }
                    );
                }
            )

    }

    render() {
        let listOfIngredients = [];
        if (null !== this.state) {
            listOfIngredients = this.state.ingredientList.map((ingredient) => this.renderIngredient(ingredient['strIngredient1']))
        }

        if (listOfIngredients.length === 0) {
            return (
                <div className="col-12 inline nopadding">
                    <SearchForFilter inputEventHandler={this.inputEventHandlerIngredients} />
                    <br/>
                    <span>Empty list</span>
                </div>
            )
        }

        return (
            <div className="col-12 inline nopadding">
                <SearchForFilter inputEventHandler={this.inputEventHandlerIngredients} />
                <br/>
                <ul className="ingredient-list nopadding">{listOfIngredients}</ul>
            </div>
        );
    }
}

class TotalEurBasket extends React.Component {
    render() {
        return (
            <span className="label-eur">{this.props.totalEur} €</span>
        )
    }
}

class SearchForFilter extends React.Component {
    render() {
        return (
            <input type="text" className="form-control" onChange={this.props.inputEventHandler} placeholder="Type to filter..." />
        );
    }
}

class App extends React.Component {
    state = {
        'cocktailsList': [],
        'selectedCocktails': [],
        'totalEurBasket': 0
    };

    selectedCocktailHandler = (c, isBasket) => {
        if (isBasket) return true;
        c = {
            'strDrink': c['strDrink'],
            'strDrinkThumb': c['strDrinkThumb'],
            'drinkEur': Math.floor(Math.random() * 10) + 1
        }
        this.state.selectedCocktails.push(c)

        let newTotalEur = this.state.totalEurBasket + c['drinkEur']
        this.setState(
            {
                'selectedCocktails': this.state.selectedCocktails,
                'totalEurBasket': newTotalEur
            }
        )
    }

    deleteClickHandler = (c) => {
        let cocktails = [... this.state.selectedCocktails];
        let cocktailIndex = cocktails.findIndex(p => {
            return p === c
        });
        let newTotalEur = this.state.totalEurBasket - cocktails[cocktailIndex]['drinkEur']
        cocktails.splice(cocktailIndex, 1);
        this.setState(
            {
                'selectedCocktails': cocktails,
                'totalEurBasket': newTotalEur
            }
        )
    }

    renderCocktailList(cocktails, isBasket) {
        let listOfSelectedCocktails = [];
        
        if (0 < cocktails.length) {
            listOfSelectedCocktails = cocktails.map((c) => {
                return (
                    <Cocktail
                        isBasket={isBasket}
                        clickHandler={() =>{this.selectedCocktailHandler(c, isBasket)}}
                        deleteClickHandler={() => this.deleteClickHandler(c)}
                        key={c['strDrink'].replace(/\s/g, '_').toLowerCase()}
                        cocktailData={c}/>
                )
            })
        }

        if (listOfSelectedCocktails.length === 0) {
            return (
                <div className="col-12 inline nopadding">
                    <span>Empty list</span>
                </div>
            )
        }

        return (
            <div className="col-12 inline nopadding">
                <ul className="cocktail-list nopadding">{listOfSelectedCocktails}</ul>
            </div>
        );
    }

    handleIngredientClick = (i) => {
        fetch("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + i)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState(
                        {
                            'ingredientList': [],
                            'cocktailsList': result['drinks']
                        }
                    )
                }
            )
    }

    render() {
        return (
            <div>
                <div className="jumbotron text-center">
                    <h1>Enjoy your &nbsp;<i className="fas fa-cocktail"/>ocktail Experience!</h1>
                    <p>Resize this responsive page to see the effect!</p>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-4">
                            <h4>Tap an Ingredient</h4>
                            <br/>
                            <Ingredients handleIngredientClick={this.handleIngredientClick}/>
                        </div>
                        <div className="col-sm-4">
                            <h4>Make your Choice</h4>
                            <br/>
                            <Cocktails renderCocktailList={() => this.renderCocktailList(this.state.cocktailsList, false)}/>
                        </div>
                        <div className="col-sm-4">
                            <h4>Confirm your Basket - <TotalEurBasket totalEur={this.state.totalEurBasket} /></h4>
                            <br/>
                            <Basket renderCocktailList={() => this.renderCocktailList(this.state.selectedCocktails, true)}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);
