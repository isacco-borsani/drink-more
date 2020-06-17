import React from "react";

export class Cocktail extends React.Component {
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

export class Ingredient extends React.Component {
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
            <input type="text" className="form-control" onChange={this.props.inputEventHandler} placeholder="Type to filter..." />
        );
    }
}