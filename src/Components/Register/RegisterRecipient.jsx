import React from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Picky from 'react-picky';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { GetValidUserToken } from '../UserTokenHelper.js';
import ReactGA from 'react-ga';

class RegisterRecipient extends React.Component {
    constructor(props) {
        super(props);
        ReactGA.initialize('UA-61074648-2');
        ReactGA.pageview(window.location.pathname + window.location.search);

        window.parent.postMessage("[urlchange]" + props.location.pathname, '*');
        console.log('checking autoResize')
        if ('parentIFrame' in window) {
            window.parent.postMessage("[resizerIsDisabled]false", "*");
            parentIFrame.autoResize(true);
            console.log('restoring autoResize')
        }
        const researchNoteId = this.props.match.params.researchnote;
        this.state = {
            researchNoteId: researchNoteId,
            isAuthenticated: false,
            isSendingData: false,
            isLoadingFilters: true,
            hasSentData: false,
            email: "",
            lastName: "",
            firstName: "",
            disableEmail: false,
            disableCompanyName: false,
            acceptTermsAndConditions: false,
            showInvalidEmailMessage: false,
            showRequiredEmailMessage: false,
            showInvalidFirstNameMessage: false,
            showInvalidLastNameMessage: false,
            showInvalidCountryMessage: false,
            showInvalidInvestorTypeMessage: false,
            showRecipientFunctionalityHiddenModal: false,
            showInvalidInvestorTypeModal: false,
            showInvalidServerEmailModal: false,
            ShowBlockCountryModal: false,
            ShowBlockedUserModal: false,
            contactEmail:"",
            InvalidEmailMessage:"",
            showtandcMessage: false,
            SelectedCountry: null,
            SelectedInvestorType: null,
            filters: null,
            showSuccessModal: false,
            showSendingModal: false,
            providerPortalCompanyName: "",
            hideInvestorType: false
        };
        this.handleEmailInput = this.handleEmailInput.bind(this);
        this.handleFirstNameInput = this.handleFirstNameInput.bind(this);
        this.handleLastNameInput = this.handleLastNameInput.bind(this);
        this.selectCountryChange = this.selectCountryChange.bind(this);
        this.selectInvestorTypeChange = this.selectInvestorTypeChange.bind(this);
        this.handleRegisterClick = this.handleRegisterClick.bind(this);
        this.handTermsAndConditionCheck = this.handTermsAndConditionCheck.bind(this);
        this.handleCloseSuccessModal = this.handleCloseSuccessModal.bind(this);
        this.handleCloseInvalidInvesterModal = this.handleCloseInvalidInvesterModal.bind(this);
        this.handleCloseInvalidCountryModal = this.handleCloseInvalidCountryModal.bind(this);
        this.handleCompanyNameInput = this.handleCompanyNameInput.bind(this);
    }


    componentDidMount() {
        this.GetFilters();
    }
    handleCloseInvalidCountryModal() {

        this.setState({

            ShowBlockCountryModal: false,
            SelectedCountry: null
        });
    }
    handleCloseInvalidInvesterModal() {

        this.setState({

            showInvalidInvestorTypeModal: false,
            SelectedInvestorType: null
        });
    }
    handleEmailInput(event) {
        this.setState({
            email: event.target.value
        });
    }

    handleRegisterClick(event) {



        this.setState({
            showInvalidFirstNameMessage: this.state.firstName.length === 0,
            showInvalidLastNameMessage: this.state.lastName.length === 0,
            showRequiredEmailMessage: this.state.email.length === 0,
            showInvalidEmailMessage: this.state.email.length > 0 && this.validateEmail(this.state.email) === false,
            showInvalidCountryMessage: this.state.SelectedCountry === null,
            showInvalidInvestorTypeMessage: this.state.SelectedInvestorType === null && this.state.hideInvestorType === false,
            showtandcMessage: this.state.acceptTermsAndConditions === false,
            hideInvestorType: this.state.hideInvestorType ===true
        });


        if (this.state.firstName.length === 0 ||
            this.state.lastName.length === 0 ||
            this.state.email.length === 0 ||
            this.validateEmail(this.state.email) === false ||
            this.state.SelectedCountry === null ||
            (this.state.SelectedInvestorType === null && this.state.hideInvestorType === false) ||
            this.state.acceptTermsAndConditions === false
        ) {
            this.setState({
                isSendingData: false
            });
        } else {
            this.setState({
                showSendingModal: true
            }, this.sendRegistration());
        }


    }
    handleCloseSuccessModal() {

        this.setState({
            showSuccessModal: false, showSendingModal: false, showRecipientFunctionalityHiddenModal: false,
            showInvalidInvestorTypeModal: false, showInvalidServerEmailModal:false
        });
    }
    sendRegistration() {
        var url =
            "/providerportalentry/AddRecipient";
        window.parent.postMessage("[scrollToTop]", "*");
        const providerId = document.getElementById('provider-id').value;
        var countryId = "";
        if (this.state.SelectedCountry !== null) {
            countryId = this.state.SelectedCountry.Value;
        }
        var investorTypeId = "";
        if (this.state.SelectedInvestorType !== null && this.state.hideInvestorType === false) {
            investorTypeId = this.state.SelectedInvestorType.Value;
        } else {
            investorTypeId = 0;
        }
        //
        axios.get(url,
            {
                params: {
                    email: this.state.email,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    countryId: countryId,
                    investorTypeId: investorTypeId,
                    providerId: providerId,
                    providerPortalCompanyName: this.state.providerPortalCompanyName,
                   researchNoteId: this.state.researchNoteId
                }
            }).then((response) => {

                console.log(response.data.ContentProviderRecipientFunctionalityIsEnabled);

                this.setState({
                    isSendingData: false,
                    showSuccessModal: response.data.IsSuccessFull,
                    showSendingModal: false,
                    showRecipientFunctionalityHiddenModal: response.data.ShowRecipientFunctionalityHiddenModal,
                    showInvalidInvestorTypeModal: response.data.ShowInvalidInvestorTypeModal,
                    showInvalidServerEmailModal: response.data.ShowInvalidServerEmailModal,
                    ShowBlockCountryModal: response.data.ShowBlockCountryModal,
                    ShowBlockedUserModal: response.data.EnsureRecipientRelationshipResponse.IsACancelledRecipient,
                    contactEmail: response.data.EnsureRecipientRelationshipResponse.ProviderContactEmail,
             
                    InvalidEmailMessage: response.data.EnsureRecipientUserResponse.EmailFeedback
                });

            });
    }
    handleFirstNameInput(event) {
        this.setState({
            firstName: event.target.value
        });
    }

    handleLastNameInput(event) {
        this.setState({
            lastName: event.target.value
        });
    }

    handleCompanyNameInput(event) {
        this.setState({providerPortalCompanyName: event.target.value});
    }
  
    handTermsAndConditionCheck(event) {
        const target = event.target;



        this.setState({
            acceptTermsAndConditions: target.checked
        });
    }

    validateEmail(email) {
        var re =
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    selectCountryChange(value) {

        this.setState({ SelectedCountry: value });
    }

    selectInvestorTypeChange(value) {
        this.setState({ SelectedInvestorType: value });
    }

    async GetFilters() {
        const token = await GetValidUserToken();
        const url = document.getElementById('function-server-url').value +
            "/api/ProviderPortal/RegisterRecipientForm/Get";

        const providerId = document.getElementById('provider-id').value;
        console.log("Retrieve Data", url);
        axios.get(url,
            {
                params: {
                    token: token,
                    providerId: providerId,
                }
            }).then((response) => {
            console.log('Complete filters');

            var disableEmail = response.data.Email.length > 0;
            this.setState({
                isAuthenticated: response.data.IsAuthenticated,
                isLoadingFilters: false,
                firstName: response.data.FirstName,
                lastName: response.data.LastName,
                disableEmail: disableEmail,
                disableCompanyName: false,
                email: response.data.Email,
                filters: response.data,
                termsAndConditions: response.data.TermsAndConditions,
                providerPortalCompanyName: response.data.ProviderPortalCompanyName,
                hideInvestorType: response.data.HideInvestorType
            });

        });
		this.pickyref1 = React.createRef();
		this.pickyref2 = React.createRef();
		//this.selectOption = this.selectOption.bind(this);
		//this.selectMultipleOption = this.selectMultipleOption.bind(this);
    }



    ConvertSelectedArrayToString(arrayObject) {
        let output = "";

        for (var key in arrayObject) {
            if (arrayObject.hasOwnProperty(key)) {
                output = output + arrayObject[key].Value + ",";
            }
        }

        return output;
    }




    render() {
        const state = this.state;

        const providerName = document.getElementById('provider-name').value;

        //if (state.isAuthenticated ===  'False') {
        //    return (
        //        <p>Sorry not logged in</p>
        //    );
        //}
        if (state.isLoadingFilters === true) {
            return (
                <div className="loading">
                    <div className="sk-folding-cube">
                        <div className="sk-cube1 sk-cube"></div>
                        <div className="sk-cube2 sk-cube"></div>
                        <div className="sk-cube4 sk-cube"></div>
                        <div className="sk-cube3 sk-cube"></div>
                    </div>
                    <p>Loading Registration Form</p>
                </div>
            );
        } else {
            return (
                <React.Fragment>
                <div className="container-fluid">
				 <div className="row">
                        <div className="col-12 p-0">
				            <header className="masthead">
					            <div className="banner-overlay"></div>
					            <div className="header-overlay"></div>
						            <div className="container">
						              <div className="row">
							            <div className="col-lg-8 col-md-10 mx-auto">
							              <div className="site-heading">
								            <h1>Registration</h1>
								            <span className="subheading">Please enter your details</span>
							              </div>
							            </div>
						              </div>
					            </div>
				             </header>
					</div>
						  </div>
                    <Modal
                        isOpen={this.state.showSuccessModal}
                        contentLabel="Account Created"
						className="modal-window"
                        overlayClassName={"theme-" + document.getElementById("provider-name").value + " modal-overlay"}
                        closeTimeoutMS={500}
                    >
                        <div className="row">
						<Link className="btn-close" aria-label="Close" data-dismiss="modal" to={`/portal/${providerName}`}><FontAwesomeIcon icon={ faTimes } size="lg" /></Link>
                        
                            <div className="col-sm-12 text-center">
                                <h2><FontAwesomeIcon icon={ faCheckCircle } size="lg" />Account Created</h2>
                            </div>
                            {this.state.isAuthenticated === true &&

                            <div className="col-sm-12 text-center">
                                    Registration complete.
                            </div>

                            }
                            {this.state.isAuthenticated === false &&

                                <div className="col-sm-12 text-center">
                                    <p>Please check your inbox and junk folder for our confirmation and login email</p>
                            </div>

                            }
							
                        </div>

                    </Modal>
                    <Modal
                        isOpen={this.state.showInvalidInvestorTypeModal}
                        contentLabel="No Access"
                        className="modal-window"
                        overlayClassName={"theme-" + document.getElementById("provider-name").value + " modal-overlay"}
                        closeTimeoutMS={500}
                    >
                        <div className="row">
					      <div className="col-12 text-center">
                                <h2><FontAwesomeIcon icon={ faExclamationCircle } size="lg" />No Access</h2>
                            </div>

                            <div className="col-12 text-center">
                                <p>No Access - This Portal is for Institutional, High Net Worth and Sophisticated Investors.</p>
                          </div>
                            
                        </div>
                        <div className="col-12  text-center">
                            <button className="btn-primary" onClick={this.handleCloseInvalidInvesterModal}>Close</button>
                        </div>
                    </Modal>
                <Modal
                        isOpen={this.state.ShowBlockCountryModal}
                    contentLabel="No Access"
                    className="modal-window"
                    overlayClassName={"theme-" + document.getElementById("provider-name").value + " modal-overlay"}
                    closeTimeoutMS={500}
                >
                    <div className="row">
                        <div className="col-12 text-center">
                            <h2><FontAwesomeIcon icon={faExclamationCircle} size="lg" />No Access</h2>
                        </div>

                        <div className="col-12 text-center">
                            <p>Sorry you are not able to access the research from the selected country</p>
                        </div>

                    </div>
                    <div className="col-12  text-center">
                            <button className="btn-primary" onClick={this.handleCloseInvalidCountryModal}>Close</button>
                    </div>
                    

                </Modal>
                <Modal
                        isOpen={this.state.showInvalidServerEmailModal}
						contentLabel="Invalid Email"
						className="modal-window"
                        overlayClassName={"theme-" + document.getElementById("provider-name").value + " modal-overlay"}
                        closeTimeoutMS={500}
                >
                    <div className="row">
					<Link className="btn-close" aria-label="Close" data-dismiss="modal" to={`/portal/${providerName}`}><FontAwesomeIcon icon={ faTimes } size="lg" /></Link>
                        <div className="col-sm-12 text-center">
                            <h2><FontAwesomeIcon icon={faExclamationCircle} size="lg" />No Access</h2>
                        </div>

                        <div className="col-sm-12 text-center">
                                <p>{this.state.InvalidEmailMessage}</p>
                        </div>
                        
                    </div>

                    </Modal>
                <Modal
                        isOpen={this.state.ShowBlockedUserModal}
                    contentLabel="Account Frozen"
                    className="modal-window"
                            overlayClassName={"theme-" + document.getElementById("provider-name").value + " modal-overlay"}
                            closeTimeoutMS={500}

                    
                >
                    <div className="row">
                        <Link className="btn-close" aria-label="Close" data-dismiss="modal" to={`/portal/${providerName}`}><FontAwesomeIcon icon={faTimes} size="lg" /></Link>
                        <div className="col-12 text-center">
                                <h2><FontAwesomeIcon icon={faExclamationCircle} size="lg" />Account Frozen</h2>
                        </div>

                        <div className="col-12 text-center">
                                <p>Apologies but your access account has been frozen. Please contact <a href={"mailto:" + this.state.contactEmail} target="_top">{
                                    this.state.contactEmail}</a> if you would like to enquire further.</p>
                        </div>

                    </div>

                </Modal>
                
                    <Modal
                        isOpen={this.state.showSendingModal}
                        contentLabel="Sending Registration"
                        className="modal-window"
                            overlayClassName={"theme-" + document.getElementById("provider-name").value + " modal-overlay"}
                            closeTimeoutMS={500}

                      
                    >
                        <div className="row">
                            <div className="col-12 text-center">
                                <h2>Sending Registration</h2>
                            </div>

                            <div className="col-12 text-center">
                                <p>Please wait while we send your registration details</p>
                            </div>
							   <div className="loading">
								<div className="sk-folding-cube">
									  <div className="sk-cube1 sk-cube"></div>
									  <div className="sk-cube2 sk-cube"></div>
									  <div className="sk-cube4 sk-cube"></div>
									  <div className="sk-cube3 sk-cube"></div>
								</div>
								<p>Sending details</p>
							</div>
                        </div>

                    </Modal>
                    <Modal
                        isOpen={this.state.showRecipientFunctionalityHiddenModal}
                        contentLabel="Error"
                        className="modal-window"
                            overlayClassName={"theme-" + document.getElementById("provider-name").value + " modal-overlay"}
                            closeTimeoutMS={500}

                       
                    >
                        <div className="row">
						<Link className="btn-close" aria-label="Close" data-dismiss="modal" to={`/portal/${providerName}`}><FontAwesomeIcon icon={ faTimes } size="lg" /></Link>
                            <div className="col-12 text-center">
                                <h2><FontAwesomeIcon icon={ faExclamationCircle } size="lg" />Error</h2>
                            </div>

                            <div className="col-12 text-center">
                                This provider does not support this function.
                            </div>
                            
                        </div>

                    </Modal>

					
                    <div className="row">
                        <div className="col-sm-12 col-lg-6  ">
                            <div className="row">
                                <div className="offset-sm-1 col-sm-10 ">
                                    First Name
                        {this.state.showInvalidFirstNameMessage === true &&

                                        <span className="error"> (required)</span>

                                    }
                                </div>
                            </div>
                            <div className="row">
                                <div className="offset-sm-1 col-sm-10 ">
                                    <input id="input-first-name" onChange={this.handleFirstNameInput}
                                        value={this.state.firstName
                                        } placeholder="Please enter your first name" className="form-control" title="Please enter your first name" />

                                </div>
                            </div>
                            <div className="row">
                                <div className="offset-sm-1 col-sm-10 ">
                                    Last Name
                                {this.state.showInvalidLastNameMessage === true &&
                                        <span className="error"> (required)</span>
                                    }

                                </div>
                            </div>

                            <div className="row">
                                <div className="offset-sm-1 col-sm-10 ">
                                    <input id="input-last-name" onChange={this.handleLastNameInput}
                                        value={this.state.lastName
                                        } placeholder="Please enter your last name" className="form-control" title="Please enter your last name" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="offset-sm-1 col-sm-10 ">
                                    Email
                        {this.state.showInvalidEmailMessage === true &&

                                        <span className="error"> (incorrect format)</span>

                                    }
                                    {this.state.showRequiredEmailMessage === true &&

                                        <span className="error"> (required)</span>

                                    }

                                </div>
                            </div>
                            <div className="row">
                                <div className="offset-sm-1 col-sm-10 ">
                                    <input id="input-email" disabled={this.state.disableEmail} onChange={this.handleEmailInput}
                                        value={this.state.email
                                        } placeholder="Please enter your email address" className="form-control" title="Please enter your email address" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="offset-sm-1 col-sm-10 ">
                                    Company Name (If Applicable)
                                </div>
                            </div>
                            <div className="row">
                                <div className="offset-sm-1 col-sm-10 ">
                                    <input id="input-company-name" disabled={this.state.disableCompanyName} onChange={this.handleCompanyNameInput}
                                        value={this.state.providerPortalCompanyName
                                        } placeholder="Optional" className="form-control" title="Optional" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="offset-sm-1 col-sm-10 ">
                                    Please select your country
                        {this.state.showInvalidCountryMessage === true &&

                                        <span className="error"> (required)</span>

                                    }
                                </div>
                            </div>
                            <div className="row">
                                <div className="offset-sm-1 col-sm-10 ">
                                    <Picky
                                        options={state.filters.CountriesListed}
                                        placeholder='Select Country'
                                        value={state.SelectedCountry}
                                        multiple={false}
                                        includeSelectAll={false}
                                        includeFilter={true}
                                        onChange={this.selectCountryChange}
                                        dropdownHeight={300}
                                        valueKey="Value"
                                        labelKey="Text"
                                        keepOpen={false}
										className="form-inputs"
										ref={this.pickyref1}
										  onOpen={() => {
											this.pickyref1.current.node.children[0].classList.toggle(
											  "selected"
											);
										  }}
										  onClose={() => {
											this.pickyref1.current.node.children[0].classList.toggle(
											  "selected"
											);
										  }}
                                        render={({
                                        className,
										style,
										isSelected,
										item,
										selectValue,
										labelKey,
										valueKey,
										multiple,
									  }) => {
										return (
										  <li
											style={style} // required
											className={isSelected ? 'selected' : ''} // required to indicate is selected
											key={item[valueKey]} // required
											onClick={() => selectValue(item)}
										  >{item[labelKey]}
						
											<input type="radio" checked={isSelected} />
											<span className="radiomark"></span>
										  </li>
										);
									  }}
									/>

                                </div>
                                </div>

                                {this.state.hideInvestorType === false &&
                                    <div className="row">
                                        <div className="offset-sm-1 col-sm-10 ">
                                            I confirm that I am a :   {this.state.showInvalidInvestorTypeMessage === true &&

                                                <span className="error">*</span>

                                            }
                                        </div>
                                    </div>
                                }
                                { this.state.hideInvestorType === false && 
                                <div className="row">
                                    <div className="offset-sm-1 col-sm-10 ">
                                        <Picky
                                            options={state.filters.InvestorTypeListed}
                                            placeholder='Select Investor Type'
                                            value={state.SelectedInvestorType}
                                            multiple={false}
                                            includeSelectAll={false}
                                            includeFilter={true}
                                            onChange={this.selectInvestorTypeChange}
                                            dropdownHeight={300}
                                            valueKey="Value"
                                            labelKey="Text"
                                            keepOpen="false"
                                            className="form-inputs"
                                            ref={this.pickyref2}
                                            onOpen={() => {
                                                this.pickyref2.current.node.children[0].classList.toggle(
                                                    "selected"
                                                );
                                            }}
                                            onClose={() => {
                                                this.pickyref2.current.node.children[0].classList.toggle(
                                                    "selected"
                                                );
                                            }}
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
                                                        <span className="radiomark"></span>
                                                    </li>
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                                }
                                    

                                
                               

                            
                        </div>
                        <div className="col-sm-12 col-lg-6 ">
							<section>
                            <span dangerouslySetInnerHTML={{ __html: this.state.filters.TermsAndConditions }} />
                                {this.state.showInvalidFirstNameMessage === true &&
                                    <div className="row">
                                    <span className="error">Please enter a first name.</span>
                                </div>
                                    
                                   
                                }
                                {this.state.showInvalidLastNameMessage === true &&
                                    <div className="row">
                                    <span className="error">Please enter a last name.</span>
                                    </div>
                                }
                            {this.state.showInvalidEmailMessage === true &&
                                    <div className="row">
                                    <span className="error"> Please enter a valid email address.</span>
                                    </div>
                                }
                            {this.state.showRequiredEmailMessage === true &&
                                        <div className="row">
                                    <span className="error"> Please enter an email address.</span>
                                        </div>
                                }
                                {this.state.showInvalidCountryMessage === true &&
                                        <div className="row">
                                    <span className="error">Please select a valid Country.</span>
                                        </div>
                                }
                            {this.state.showInvalidInvestorTypeMessage === true &&
                                            <div className="row">
                                    <span className="error">Please select a valid Investor Type.</span>
                                            </div>
                                }
                                {this.state.showtandcMessage === true &&
                                    <div className="row">
                                    <span className='error'>You must agree to the terms and conditions before proceeding</span>

                                    </div>
                                 }
                                <label className="form-inputs">
                                    <li>I agree to the above terms and conditions
							        <input name="chk-agree" type="checkbox" checked={this.state.acceptTermsAndConditions} onChange={this.handTermsAndConditionCheck} />
                                    <span className="checkmark"></span>
                                    {this.state.showtandcMessage === true &&
                                        <span className='error'> *</span>
                                        }
                                        </li>
                                </label>
							 <div className="row">
								<div className="col-sm-11 text-right ">
									<button href="" className="btn-primary" disabled={this.state.isSendingData} onClick={this.handleRegisterClick
										}><FontAwesomeIcon icon={ faArrowCircleRight } size="lg" />Register</button>

								</div>
							</div>
							</section>
                        </div>
						
                    </div>
               
                    </div>
                </React.Fragment>
            );
        }
    }

}

export default RegisterRecipient;
