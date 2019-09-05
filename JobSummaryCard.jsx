import React from 'react';
import Cookies from 'js-cookie';
import { Popup } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.selectJob = this.selectJob.bind(this)
    }

    selectJob(id) {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'https://talentservicestalentrose.azurewebsites.net/listing/listing/closeJob',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            dataType: 'json',
            type: "post",
            data: JSON.stringify(id),
            success: function (data) {
                if (data.success == true) {
                    this.props.reloadData();

                    TalentUtil.notification.show(data.message, "success", null, null)
                } else {
                    TalentUtil.notification.show(data.message, "error", null, null)
                }


            }.bind(this)

        })
    }

    render() {

        var data = this.props.data;
        //console.log(data);

        var buttonClick = undefined;
        if (data.status == 0) {
            buttonClick =
                <div className="ui right floated mini buttons">
                    <button
                        className="right floated ui mini basic blue button"
                        onClick={() => this.selectJob(data.id)}
                    >
                        <i className="ban icon" />Close
                    </button>
                    <button
                        className="right floated ui mini basic blue button"
                        onClick={() => { window.location = "/EditJob/" + data.id }}
                    >
                        <i className="edit icon" />Edit
                    </button>
                    <button
                        className="right floated ui mini basic blue button"
                        onClick={() => { window.location = "/PostJob/" + data.id }}>
                        <i className="copy icon" />Copy
                    </button>
                </div>
        }



        return (
            <div className="card " >
                <div className="content">
                    <div className="header">{data.title} </div>
                    <Popup trigger={
                        <a className="ui black right ribbon label">
                            <i className="user icon"></i>{data.noOfSuggestions}
                        </a>
                    }>

                    </Popup>

                    <div className="meta"> {data.location.city}, {data.location.country}</div>

                    <div className="description job-summary">
                        {data.summary}
                    </div>
                </div>
                <div className="extra content">
                    {buttonClick != undefined ? buttonClick : null}
                    {
                        moment(data.expiryDate) < moment() ?
                            <label className="ui red left floated label">
                                Expired
                    </label> : null}
                </div>
            </div>
        )



    }
}