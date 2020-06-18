import React from "react";
import './components.css';

export class Cocktail extends React.Component {
    render() {
        let currentIcon = (
            <div onClick={this.props.moreInfoHandler} className="deleteCocktailIcon">
                <i className="fas fa-info"/>
            </div>
        );
        if (this.props.isBasket) {
            currentIcon = (
                <div onClick={this.props.deleteClickHandler} className="deleteCocktailIcon">
                    <i className="fas fa-times"/>
                </div>
            )
        }
        return (
            <div className="pic-container">
                <img onClick={this.props.clickHandler} className="image"
                     src={this.props.cocktailData['strDrinkThumb']} alt=""/>
                {currentIcon}
                <hr/>
            </div>
        );
    }
}

export class Ingredient extends React.Component {
    render() {
        let imgLink = "https://www.thecocktaildb.com/images/ingredients/" + this.props.ingredientData + "-Small.png";
        let ingredientQty = '';
        if (null !== this.props.ingredientQty && undefined !== this.props.ingredientQty) {
            ingredientQty = this.props.ingredientQty;
        }
        return (
            <li onClick={() => {
                this.props.clickHandler(this.props.ingredientData)
            }}>
                <img src={imgLink} alt=""/>{this.props.ingredientData}
                <span className="ingredient-qty">{ingredientQty}</span>
                <hr/>
            </li>
        );
    }
}

export class Cocktails extends React.Component {
    render() {
        return this.props.renderCocktailList(this.props['cocktails']);
    }
}

export class Basket extends React.Component {
    render() {
        return this.props.renderCocktailList(this.props.selectedCocktails);
    }
}

export class Ingredients extends React.Component {
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
        return <Ingredient clickHandler={this.props.handleIngredientClick} key={i.replace(/\s/g, '_').toLowerCase()}
                           ingredientData={i}/>;
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
                    <SearchForFilter inputEventHandler={this.inputEventHandlerIngredients}/>
                    <br/>
                    <span>Empty list</span>
                </div>
            )
        }

        return (
            <div className="col-12 inline nopadding">
                <SearchForFilter inputEventHandler={this.inputEventHandlerIngredients}/>
                <br/>
                <ul className="ingredient-list nopadding">{listOfIngredients}</ul>
            </div>
        );
    }
}

export class TotalEurBasket extends React.Component {
    render() {
        return (
            <span className="label-eur">{this.props.totalEur} €</span>
        )
    }
}

export class SearchForFilter extends React.Component {
    render() {
        return (
            <input type="text" className="form-control" onChange={this.props.inputEventHandler}
                   placeholder="Type to filter..."/>
        );
    }
}

export class ConfirmationDialog extends React.Component {
    render() {
        return (
            <div className='custom-ui'>
                <h1 className="text-center">Confirmation dialog</h1>
                <br/>
                <div className="container">
                    <form action="#" onSubmit={this.props.submitOrder}>
                        <div className="col-4 inline">
                            <input type="text" className="form-control" placeholder="Name" required/>
                        </div>
                        <div className="col-4 inline">
                            <input type="text" className="form-control" placeholder="Surname" required/>
                        </div>
                        <br/><br/>
                        <div className="col-4 inline">
                            <input type="number" className="form-control" placeholder="Table number" required/>
                        </div>
                        <br/><br/><br/>

                        <div className="col-6">
                            <span className="totalInDialog">Total: {this.props.totalEurBasket} €</span>
                        </div>

                        <div className="col-1 inline">
                            <img width="50px"
                                 src="https://miiego.com/wp-content/uploads/2018/09/mastercard-logo-icon-png_44630.png"
                                 alt=""/>
                        </div>
                        <div className="col-5 inline">
                            <input type="text"
                                   className="form-control"
                                   placeholder="Put here your credit card code"
                                   required
                            />
                        </div>
                        <br/>
                        <hr/>
                        <button type="submit" className="btn btn-xs btn-success float-right mr-2">
                            <i className="fas fa-check mr-2"/>&nbsp;Proceed
                        </button>
                        <button onClick={this.props.onClose} className="btn btn-xs btn-danger float-right cancel-order">
                            <i className="fas fa-times mr-2"/>&nbsp;Cancel
                        </button>
                        &nbsp;&nbsp;
                    </form>
                </div>
            </div>
        )
    }
}

export class MoreInfoDialog extends React.Component {
    render() {

        let ingredients = [];
        for (let i = 0; i < 15; i++) {
            if (null !== this.props.cocktail['strIngredient' + i] &&
                undefined !== this.props.cocktail['strIngredient' + i]) {
                ingredients.push(<Ingredient
                    clickHandler={() => {
                        return true
                    }}
                    ingredientQty={this.props.cocktail['strMeasure' + i]}
                    key={this.props.cocktail['strIngredient' + i]}
                    ingredientData={this.props.cocktail['strIngredient' + i]}/>)
            }
        }

        return (
            <div className='custom-ui-more-info'>
                <div className="row">
                    <div className="col-11">
                        <h1 className="text-center">{this.props.cocktail['strDrink']}</h1>
                    </div>
                    <div className="col-1">
                        <span onClick={this.props.onClose} className="close-modal-info float-right"><i
                            className="fas fa-times"/></span>
                    </div>
                </div>

                <br/>
                <div className="container">
                    <div className="row">
                        <div className="col-12 text-center bg-b">
                            <img width="25%" src={this.props.cocktail['strDrinkThumb']} alt=""/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <ul className="inline-ingredients">
                                {ingredients}
                            </ul>
                        </div>
                    </div>
                    <div className="row main-info">
                        <div className="col-6">
                            <span>Alcoholic: {this.props.cocktail['strAlcoholic']}</span>
                        </div>
                    </div>
                    <div className="row main-info">
                        <div className="col-6">
                            <span>Category: {this.props.cocktail['strCategory']}</span>
                        </div>
                    </div>
                    <div className="row main-info">
                        <div className="col-12 text-center">
                            <span>Instructions</span><br/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 text-center">
                            <span>{this.props.cocktail['strInstructions']}</span>
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-12 text-center">
                            <button onClick={this.props.clickHandler} className="btn btn-xs btn-primary"><i
                                className="fas fa-plus mr-2"/>
                                &nbsp;Add to your basket
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}