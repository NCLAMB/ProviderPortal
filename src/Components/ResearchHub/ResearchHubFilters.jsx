
import React from 'react';
import ComboPicker from './Picker.jsx';
import Picky from 'react-picky';

const ResearchHubFilters = (props) => {
    
    var state = props.researchHub.state;
    var pickyref1 = React.createRef();
    return (
        <div className="row">
            <div className="col-sm-12">
                <div className="search-header">
                    <p>Filter Results</p>
                </div>
            </div>

            <div className="col-sm-12">
                <input id="input-search-term" value={state.SearchTerm} placeholder="Search" onChange={props.researchHub.handleSearchInput} className="form-control trigger-search" title="Enter a company name or ticker" />
            </div>
            {state.filters.ContentProviderWithFiltersViewModel.ShowAnalystFilter ?
                <div className="col-sm-12">
                    <Picky
                        options={state.filters.ContentProviderWithFiltersViewModel.AuthorsListed}
                        placeholder='Analyst'
                        value={state.SelectedAnalyst}
                        multiple={false}
                        includeSelectAll="true"
                        includeFilter="true"
                        onChange={props.researchHub.selectAnalystChange}
                        dropdownHeight={500}
                        valueKey="Value"
                        labelKey="Text"
                        className="form-inputs"
                        ref={pickyref1}
                        onOpen={() => {
                            pickyref1.current.node.children[0].classList.toggle(
                                "selected"
                            );
                        }}
                        onClose={() => {
                            pickyref1.current.node.children[0].classList.toggle(
                                "selected"
                            );
                        }}
                        open={false}
                        render={({
                            className,
                            style,
                            isSelected,
                            item,
                            selectValue,
                            labelKey,
                            valueKey,
                            multiple
                        }) => {
                            return (
                                <li
                                    style={style} // required
                                    className={isSelected ? 'selected' : ''} // required to indicate is selected
                                    key={item[valueKey]} // required
                                    onClick={() => selectValue(item)}
                                >{item[labelKey]}

                                    <input type="radio" checked={isSelected} />
                                    <span className="radiomark"/>
                                </li>
                            );
                        }}
                    />



                </div> : null}

            {state.filters.ContentProviderWithFiltersViewModel.ShowCountriesFilter ?
                <div className="col-sm-12">
                    <ComboPicker options={state.filters.ContentProviderWithFiltersViewModel.CountriesListed}
                        placeholder="Countries"
                        value={state.SelectedCountries}
                        onChange={props.researchHub.selectCountriesChange}
                        pickyref={React.createRef()}
            />

                </div>
                : null}

            {state.filters.ContentProviderWithFiltersViewModel.ShowSectorsFilter ?
                <div className="col-sm-12">
                    <ComboPicker options={state.filters.ContentProviderWithFiltersViewModel.Sectors}
                        placeholder="Sectors"
                        value={state.SelectedSectors}
                        onChange={props.researchHub.selectSectorsChange}
                        pickyref={React.createRef()}
                    />

                </div>
                : null}

            {state.filters.ContentProviderWithFiltersViewModel.ShowRatingsFilter ?
                <div className="col-sm-12">
                    <ComboPicker options={state.filters.ContentProviderWithFiltersViewModel.Ratings}
                        placeholder="Ratings"
                        value={state.SelectedRatings}
                        onChange={props.researchHub.selectRatingsChange}
                        pickyref={React.createRef()}
                    />

                </div>
                : null}
            
      

            {state.filters.ContentProviderWithFiltersViewModel.ShowReportLengthFilter ?
                <div className="col-sm-12">
                    <ComboPicker options={state.filters.ContentProviderWithFiltersViewModel.PageCounts}
                        placeholder="Report length"
                        value={state.SelectedReportLengths}
                        onChange={props.researchHub.selectReportLengthsChange}
                        pickyref={React.createRef()}
                    />

                </div>
                : null}

            {state.filters.ContentProviderWithFiltersViewModel.ShowEisFilter ?
                <div className="col-sm-12">
                    <ComboPicker options={state.filters.ContentProviderWithFiltersViewModel.Eis}
                        placeholder="Select EIS / Listed companies"
                        value={state.SelectedEis}
                        onChange={props.researchHub.selectEisChange}
                        pickyref={React.createRef()}
                    />

                </div>
                : null}

            {state.filters.ContentProviderWithFiltersViewModel.ShowReportTypeFilter ?
                <div className="col-sm-12">
                    <ComboPicker options={state.filters.ContentProviderWithFiltersViewModel.ReportTypes}
                        placeholder="Select content type"
                        value={state.SelectedReportType}
                        onChange={props.researchHub.selectReportTypeChange}
                        pickyref={React.createRef()}
                    />

                </div>
                : null}
            <div className="col-sm-12">
                <a href="" className="btn-secondary" onClick={props.researchHub.ClearFilters}>Clear filter</a>
            </div>

        </div>
        
    );
};
export default ResearchHubFilters;