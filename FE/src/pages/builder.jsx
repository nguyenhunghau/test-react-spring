import React, { useState, useEffect } from "react";
import Header from '../components/header/header';
import MenuLeft from '../components/menu/menu-left';

import { useDrop } from 'react-dnd'
import { Control } from './control'
import { ItemTypes } from './ItemTypes'
import Container from "./container";
import styles from './builder.module.css'
import { useSelector, useDispatch } from 'react-redux';

const Builder = (props) => {

    const [controlList, setControlList] = useState([]);
    const buiderSelector = useSelector(state => state.builder);
    const [collapsemenu, setCollapsemenu] = useState();
    let fileReader;
    const data = useSelector(state => state.builder);
    const dispatch = useDispatch();

    let keyMap = {};

    const saveFile = () => {
        var myURL = window.URL || window.webkitURL //window.webkitURL works in Chrome and window.URL works in Firefox
        var csv = JSON.stringify(data);
        var blob = new Blob([csv], { type: 'text/json' });
        var tempLink = document.createElement('a');
        tempLink.href = myURL.createObjectURL(blob);
        tempLink.setAttribute('download', 'export.json');
        tempLink.click();
    }
    const handleFileRead = (e) => {
        const content = fileReader.result;
        dispatch({ type: 'IMPORT', data: JSON.parse(content) });
    };

    const handleFileChosen = (file) => {
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file);
    };

    useEffect(() => {
        console.log(buiderSelector);
        setControlList(buiderSelector.data);
    }, [buiderSelector.count]);

    const handleKeyup = (event) => {
        if (keyMap[17] && keyMap[90]) {
            dispatch({ type: 'UNDO' });
            keyMap = {};
            return;
        }
        if (keyMap[17] && keyMap[89]) {
            dispatch({ type: 'REDO' });
            keyMap = {};
            return;
        }
    }

    const handleKeydown = (event) => {
        keyMap[event.keyCode] = 'handleKeydown';
    }

    return (
        <div className={collapsemenu ? 'sidebar-mini layout-fixed sidebar-collapse' : 'wrapper'} >
            <Header changeMenu={props.changeMenu} />
            <MenuLeft />
            <div className={'content-wrapper'} tabIndex="0" onKeyUp={event => handleKeyup(event)} onKeyDown={event => handleKeydown(event)}>
                <div class="content-header">
                    <div class="container-fluid">
                        <div class="row mb-2">
                            <div class="col-sm-2">
                                <h1 class="m-0 text-dark">Dashboard</h1>
                            </div>
                            <div class="col-sm-8">
                                <ol class="breadcrumb float-sm-right">
                                    <li class="nav-item d-none d-sm-inline-block">
                                        <a href="#" class="nav-link" onClick={() => saveFile()}>Save File</a>
                                    </li>
                                    <li class="nav-item d-none d-sm-inline-block">
                                        <a href="#" class="nav-link">Import file</a>
                                    </li>
                                    <li>
                                        <input
                                            type='file'
                                            id='file'
                                            className='input-file'
                                            accept='.json'
                                            onChange={e => handleFileChosen(e.target.files[0])}
                                        />
                                    </li>
                                </ol>
                            </div>
                            <div class="col-sm-2">
                                <ol class="breadcrumb float-sm-right">
                                    <li class="nav-item d-none d-sm-inline-block">
                                        <a href="#" class="nav-link" onClick={() => dispatch({ type: 'UNDO' })}>Undo</a>
                                    </li>
                                    <li class="nav-item d-none d-sm-inline-block">
                                        <a href="#" class="nav-link" onClick={() => dispatch({ type: 'REDO' })}>Redo</a>
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                <section className={'content'}>
                    <div class="container-fluid">
                        <div className={'card'} style={{ 'padding': '40px' }}>
                            <div className={`row col-md-12 ${styles.container_control}`}>
                                {controlList.map((controlLayout, i) => (
                                    <Container key={i} controlList={controlLayout} />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    )
}
export default Builder;