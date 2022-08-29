import React, { useState, Component } from 'react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './libraryTreeGrid.css'
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import Handsontable from 'handsontable'
import LibraryFiltersView from '../../pages/libraryFiltersView/libraryFiltersView.js';

class LibraryTreeGrid extends Component{

    
    render() {

        let settingsFamilies = {
            licenseKey: 'non-commercial-and-evaluation',
            colWidths: 350,
        }
    
        let settingsBrands = {
            licenseKey: 'non-commercial-and-evaluation',
            colWidths: 350,
        className:'excel'
        }
    
        let settingsTipoP= {
            licenseKey: 'non-commercial-and-evaluation',
            colWidths: 350,
        className:'excel'
        }    
    
        let settingsDisciplines= {
            licenseKey: 'non-commercial-and-evaluation',
            colWidths: 350,
        className:'excel'
        }

        return (
            <div>
                <div>
                    <div id="hot-app" className="excel__container__familias">
                        <HotTable
                            // data={this.state.tasks}
                            colHeaders = {["<b>Families</b>"]}
                            rowHeaders={false}
                            width="350"
                            height="775"
                            className="custom__table__familias"
                            rowHeights="38"
                            settings={settingsFamilies} 
                            manualColumnResize={true}
                            manualRowResize={true}
                            // columns= { [{data: "Software", type: Handsontable.cellTypes.dropdown, strict: true, source: this.state.softwares},{data: "Task"}]}
                            filters={false}
                            dropdownMenu= {[
                                'make_read_only',
                                '---------',
                                'alignment',
                                '---------',
                                'filter_by_condition',
                                '---------',
                                'filter_operators',
                                '---------',
                                'filter_by_condition2',
                                '---------',
                                'filter_by_value',
                                '---------',
                                'filter_action_bar',
                            ]}
                        />
                    </div>
                    
                    <div id="hot-app" className="excel__container__marcas">
                        <HotTable
                            // data={this.state.tasks}
                            colHeaders = {["<b>Marcas</b>"]}
                            rowHeaders={false}
                            width="350"
                            height="775"
                            className="custom__table__marcas"
                            rowHeights="38"
                            settings={settingsBrands} 
                            manualColumnResize={true}
                            manualRowResize={true}
                            // columns= { [{data: "Software", type: Handsontable.cellTypes.dropdown, strict: true, source: this.state.softwares},{data: "Task"}]}
                            filters={false}
                            dropdownMenu= {[
                                'make_read_only',
                                '---------',
                                'alignment',
                                '---------',
                                'filter_by_condition',
                                '---------',
                                'filter_operators',
                                '---------',
                                'filter_by_condition2',
                                '---------',
                                'filter_by_value',
                                '---------',
                                'filter_action_bar',
                            ]}
                        />
                    </div>

                    <div id="hot-app" className="excel__container__marcas">
                        <HotTable
                            // data={this.state.tasks}
                            colHeaders = {["<b>Tipo de proyecto</b>"]}
                            rowHeaders={false}
                            width="350"
                            height="775"
                            className="custom__table__marcas"
                            rowHeights="38"
                            settings={settingsTipoP} 
                            manualColumnResize={true}
                            manualRowResize={true}
                            // columns= { [{data: "Software", type: Handsontable.cellTypes.dropdown, strict: true, source: this.state.softwares},{data: "Task"}]}
                            filters={false}
                            dropdownMenu= {[
                                'make_read_only',
                                '---------',
                                'alignment',
                                '---------',
                                'filter_by_condition',
                                '---------',
                                'filter_operators',
                                '---------',
                                'filter_by_condition2',
                                '---------',
                                'filter_by_value',
                                '---------',
                                'filter_action_bar',
                            ]}
                        />
                    </div>

                    <div id="hot-app" className="excel__container__marcas">
                        <HotTable
                            // data={this.state.tasks}
                            colHeaders = {["<b>Disciplinas</b>"]}
                            rowHeaders={false}
                            width="350"
                            height="775"
                            className="custom__table__marcas"
                            rowHeights="38"
                            settings={settingsDisciplines} 
                            manualColumnResize={true}
                            manualRowResize={true}
                            // columns= { [{data: "Software", type: Handsontable.cellTypes.dropdown, strict: true, source: this.state.softwares},{data: "Task"}]}
                            filters={false}
                            dropdownMenu= {[
                                'make_read_only',
                                '---------',
                                'alignment',
                                '---------',
                                'filter_by_condition',
                                '---------',
                                'filter_operators',
                                '---------',
                                'filter_by_condition2',
                                '---------',
                                'filter_by_value',
                                '---------',
                                'filter_action_bar',
                            ]}
                        />
                    </div>
                </div>

                <div className='button__add__library'>
                    
                    <div style={{display: "flex", float:"center"}} >
                        <div style={{marginLeft: "300px"}}>
                            <button className="projects__add__button" type="button" onClick={()=> this.addRowTasks()} style={{width:"70px"}}><p className="projects__add__button__text">+ Add</p></button>
                        </div>
                    </div>

                    <div style={{display: "flex", float:"center"}} >
                        <div style={{marginLeft: "480px"}}>
                            <button className="projects__add__button" type="button" onClick={()=> this.addRowTasks()} style={{width:"70px"}}><p className="projects__add__button__text">+ Add</p></button>
                        </div>
                    </div>

                    <div style={{display: "flex", float:"center"}} >
                        <div style={{marginLeft: "490px"}}>
                            <button className="projects__add__button" type="button" onClick={()=> this.addRowTasks()} style={{width:"70px"}}><p className="projects__add__button__text">+ Add</p></button>
                        </div>
                    </div>

                    <div style={{display: "flex", float:"center"}} >
                        <div style={{marginLeft: "490px"}}>
                            <button className="projects__add__button" type="button" onClick={()=> this.addRowTasks()} style={{width:"70px"}}><p className="projects__add__button__text">+ Add</p></button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LibraryTreeGrid;