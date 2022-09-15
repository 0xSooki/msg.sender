import React, { useEffect, useState } from 'react'
// import {useNavigate} from 'react-router-dom'
import { NavLink } from 'react-router-dom';
import { Button } from 'reactstrap';

export default function Footer(props){
    
    return (
        <div className="footer">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-4 offset-1 col-sm-2">
                        <h5>Navigation Links</h5>
                        <div>
                            <nav className="mainnav">
                            <Button color="primary">
                            <NavLink activeClassName="activeLink" to="/">
                            Home
                            </NavLink>
                            </Button>
                            <Button color="primary">
                            <NavLink activeClassName="activeLink" to="/send-message">
                            Send Message
                            </NavLink>
                            </Button>
                            </nav>
                        </div>
                    </div>
                    <div className="col-7 col-sm-5">
                        <h5>Our ENS Address</h5>
                        <address>
                            Decentraland<br />
                            Somewhere, ENS<br />
                            <i className="fa fa-envelope fa-lg"></i>: <a href="mailto:test@test.net">
                                test@test.net</a>
                        </address>
                    </div>
                    <div className="col-12 col-sm-4 align-self-center">
                        <div className="text-center">
                            <a className="btn btn-social-icon btn-facebook" href="https://www.facebook.com/link"><i className="fa fa-facebook"></i></a>
                            <a className="btn btn-social-icon btn-twitter" href="https://twitter.com/link"><i className="fa fa-twitter"></i></a>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-auto">
                        <p>© Copyright 2022 ETH Online</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
