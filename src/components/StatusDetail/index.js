import React from 'react';
import './StatusDetail.css';

const StatusDetail = ({ statusDetail, stationDetailInfo }) => {
	if (!statusDetail || !stationDetailInfo) {
		return <div>loading...</div>;
	}

	const renderConnectorStatus = param => {
		switch (param) {
			case 1:
				return 'Available';
			case 2:
				return 'Busy';
			default:
				return 'Disconnected';
		}
	};

	const evDetail = statusDetail.evses.map((ev, index) => (
		<div key={ev.id}>
			<div className={ev.status === 1 ? 'stationAvailable stationId' : 'stationBusy stationId'}>{ev.id}</div>
			<div className={'connectorStatus-' + ev.status}>{renderConnectorStatus(ev.status)}</div>
			{stationDetailInfo.evses.map((eves, index) => {
				if (eves.id === ev.id) {
					return typeof eves.connectors[0] !== undefined ? (
						<div key={eves.id}>
							<div className="connectorStatus">Type : {eves.connectors[0].type}</div>
							<div className="connectorStatus">Power : {eves.connectors[0].maxKw} maxKw</div>
							<div className="connectorStatus">CurrentType :{eves.connectors[0].currentType} </div>
							<p />
						</div>
					) : null;
				}
			})}
		</div>
	));
	return <div className="evsesId">{evDetail}</div>;
};
export default StatusDetail;
