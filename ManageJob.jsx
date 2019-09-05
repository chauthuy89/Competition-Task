import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, Header, Grid } from 'semantic-ui-react';

const style = {
    paddingTop: 30,
    paddingBottom: 60,
    marginLeft: 20,

}
export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortbyOrder: 'desc',
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: false,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
    }
   
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
         //your functions go here
      
        this.handleItemClick = this.handleItemClick.bind(this);
        this.filterJobList = this.filterJobList.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
        this.handlePagination = this.handlePagination.bind(this);
    };
    handleItemClick(e, titles) {
        const { index } = titles
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
        this.setState({ activeIndex: newIndex })
    }
    handleSortChange(e, { value }) {
        this.state.sortbyOrder = value;
        this.loadNewData({ sortbyOrder: this.state.sortbyOrder })
    }
    filterJobList(e, { checked, name }) {
        this.state.filter[name] = checked;
        this.setState({ filter: this.state.filter });
        this.loadNewData({ activePage: 1 })
    }
    handlePagination(e, { activePage } ) {
        this.loadNewData({ activePage: activePage })
    }
    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.loadData(() =>
            this.setState({ loaderData })
        )
    }

    componentDidMount() {
        this.init();
        this.loadData();
    };

    loadData(callback) {
        var link = 'https://talentservicestalentrose.azurewebsites.net/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            data: {
                activePage: this.state.activePage,
                sortbyDate: this.state.sortbyOrder,
                showActive: this.state.filter.showActive,
                showClosed: this.state.filter.showClosed,
                showDraft: this.state.filter.showDraft,
                showExpired: this.state.filter.showExpired,
                showUnexpired: this.state.filter.showUnexpired
            },
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                this.setState({ loadJobs: data.myJobs, totalPages: Math.ceil(data.totalCount / 6) }, callback);
                console.log(data);
            }.bind(this),

        });

    }
  
    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }


    render() {
        var data = undefined;
        if (this.state.loadJobs.length > 0) {
            data = this.state.loadJobs.map(x => {
                return (
                    <JobSummaryCard key={x.id} data={x} reloadData={this.loadData} />);
            })
            console.log(data[1]);

        }
        const options = [
            {
                key: 'desc',
                text: 'Newest first',
                value: 'desc',
                content: 'Newest first',
            },
            {
                key: 'asc',
                text: 'Oldest first',
                value: 'asc',
                content: 'Oldest first',
            }
        ];
      

        const { activeIndex } = this.state;
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">
                    <Header as='h2' >List of Jobs</Header>
                    <div className="ui grid">
                        <div className="row">
                            <div className="column">
                                <span>
                                    <Icon name='filter' />
                                    {"Filter: "}

                                    <Dropdown
                                        inline simple text="Choose Filter"

                                        pointing="left">

                                        <Dropdown.Menu>

                                            <Dropdown.Item >
                                                <Accordion>
                                                    <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleItemClick} content='Status'>
                                                        <Icon name='dropdown' />
                                                    </Accordion.Title>
                                                    <Accordion.Content active={activeIndex === 1} >
                                                        <Form>
                                                            <Form.Group grouped>
                                                                <Form.Checkbox label={'Active'}
                                                                    name="showActive" onChange={this.filterJobList} checked={this.state.filter.showActive} />
                                                                <Form.Checkbox label={'Closed'}
                                                                    name="showClosed" onChange={this.filterJobList} checked={this.state.filter.showClosed} />
                                                                <Form.Checkbox label={'Draft'}
                                                                    name="showDraft" onChange={this.filterJobList} checked={this.state.filter.showDraft} />

                                                            </Form.Group>
                                                        </Form>
                                                    </Accordion.Content>
                                                </Accordion>
                                            </Dropdown.Item>

                                            <Dropdown.Item >
                                                <Accordion>
                                                    <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleItemClick} content="Expiry Date">
                                                        <Icon name='dropdown' />
                                                    </Accordion.Title>
                                                    <Accordion.Content active={activeIndex === 0} >
                                                        <Form>
                                                            <Form.Group grouped>
                                                                <Form.Checkbox label={'Expired'}
                                                                    name="showExpired" onChange={this.filterJobList} checked={this.state.filter.showExpired} />
                                                                <Form.Checkbox label={'Unexpired'}
                                                                    name="showUnexpired" onChange={this.filterJobList} checked={this.state.filter.showUnexpired} />

                                                            </Form.Group>
                                                        </Form>
                                                    </Accordion.Content>
                                                </Accordion>
                                            </Dropdown.Item>
              
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </span>
                                <span>
                                    <i className="calendar icon" />
                                    {"Sort by date: "}
                                    <Dropdown inline simple options={options}                                     
                                        onChange={this.handleSortChange}
                                        value={this.state.sortbyOrder}
                                    />
                                </span>
                                
                                <div className="ui two cards" >
                                    {
                                        data != undefined ?
                                            data :
                                            <React.Fragment>
                                                <p style={style}>No Jobs Found</p>
                                            </React.Fragment>
                                    }
                                </div>
                            </div>
                        </div>
                     
                        <div className="Centered row">

                            <Pagination
                                ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                                firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                                lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                                prevItem={{ content: <Icon name='angle left' />, icon: true }}
                                nextItem={{ content: <Icon name='angle right' />, icon: true }}
                                totalPages={this.state.totalPages}
                                onPageChange={this.handlePagination}
                            />

                        </div> 
   
                        <div className="row">
                        </div>
                       
                    </div>
                </div>
            </BodyWrapper>
        )
    }
}