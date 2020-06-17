import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {Cocktail, Cocktails, TotalEurBasket, Basket, Ingredients} from  './Components/singleComponents'

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
        let cocktails = [...this.state.selectedCocktails];
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

    submitOrderDialog = () => {
        let options = {
            title: 'Confirm to submit',
            message: 'Are you sure to do this.',
            customUI: ({onClose}) => {

                const submitOrder = (e) => {
                    e.preventDefault();
                    onClose();
                    confirmAlert({
                        title: 'Thank you!',
                        message: 'Just wait for a while and you will receive your drinks as soon as possible',
                        buttons: [
                            {
                                label: 'Ok'
                            }
                        ]
                    })
                    this.setState(
                        {
                            'cocktailsList': [],
                            'selectedCocktails': [],
                            'totalEurBasket': 0
                        }
                    )
                    return false;
                }

                return (
                    <div className='custom-ui'>
                        <h1 className="text-center">Confirmation dialog</h1>
                        <br/>
                        <div className="container">
                            <form action="#" onSubmit={submitOrder}>
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
                                    <span className="totalInDialog">Total: {this.state.totalEurBasket} €</span>
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
                                    <i className="fas fa-check mr-2"/>&nbsp;Proceed</button>
                                <button onClick={onClose} className="btn btn-xs btn-danger float-right cancel-order">
                                    <i className="fas fa-times mr-2"/>&nbsp;Cancel</button>&nbsp;&nbsp;
                            </form>
                        </div>
                    </div>
                )
            }
        }
        if (0 === this.state.selectedCocktails.length) {
            options = {
                title: 'Alert!',
                message: 'You have to select a Cocktail at least!',
                buttons: [
                    {
                        label: 'ok',
                    }
                ]
            }
        }

        confirmAlert(options);
    };

    render() {
        return (
            <div>
                <div className="header-v">
                    <div className="jumbotron text-center h-wallpaper">
                        <h1>Enjoy your &nbsp;<i className="fas fa-cocktail"/> Easly!</h1>
                        <br/>
                        <button onClick={this.submitOrderDialog} className="btn btn-dark"><span><i className="fas fa-check mr-2"/>Confirm your Order</span></button>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-4">
                            <h4 className="inline">Tap an Ingredient</h4>
                            <i className="fas fa-arrow-right float-right"/>
                            <br/>
                            <Ingredients handleIngredientClick={this.handleIngredientClick}/>
                        </div>
                        <div className="col-sm-4">
                            <h4 className="inline">Make your Choice</h4>
                            <i className="fas fa-arrow-right float-right"/>
                            <br/>
                            <Cocktails renderCocktailList={() => this.renderCocktailList(this.state.cocktailsList,
                                false)}/>
                        </div>
                        <div className="col-sm-4">
                            <h4 className="inline">Confirm your Basket - <TotalEurBasket totalEur={this.state.totalEurBasket} /></h4>
                            <br/>
                            <Basket renderCocktailList={() => this.renderCocktailList(this.state.selectedCocktails,
                                true)}/>
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
