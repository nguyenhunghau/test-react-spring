import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const Header = (props) => {
    

    return (
        <nav class="main-header navbar navbar-expand navbar-white navbar-light">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" onClick={props.changeMenu} data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
                </li>
                <li class="nav-item d-none d-sm-inline-block">
                    <a class="nav-link" >Home</a>
                </li>
            </ul>
        </nav>
    )
}
export default Header;