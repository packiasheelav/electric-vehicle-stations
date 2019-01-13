import React from 'react';
import './ModalBox.css';

const ModalBoxComponent = ({ closeModelbox, show, statusDetail, handleStationClick, stationDetailInfo }) => {

	if (!statusDetail || !stationDetailInfo) {
		return <div>loading...</div>;
	}

	const showHideClassName = show ? 'modal display-block' : 'modal display-none';
	const renderConnectorStatus = (param) => {
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
			<div className={ev.status === 1 ? 'stationAvailable stationId' : 'stationBusy stationId'} onClick={() => handleStationClick(ev.id)}>
				{ev.id}
			</div>
			<div className={'connectorStatus-' + ev.status}>{renderConnectorStatus(ev.status)}</div>
			{
				stationDetailInfo.evses.map((eves, index) => {
					if (eves.id === ev.id) {
						return (
							(typeof eves.connectors[0] !== undefined) ?(
							<div key={eves.id}>
								<div className='connectorStatus'>Type : {eves.connectors[0].type}</div>
								<div className='connectorStatus'>Power : {eves.connectors[0].maxKw} maxKw</div>
								<div className='connectorStatus'>CurrentType :{eves.connectors[0].currentType} </div>
								<p />
							</div>) : null 
						);
					}
				})
			}
		</div>
	));

	return (
		<div id="modalId" className={showHideClassName}>
			{stationDetailInfo !== undefined ? (
				<div className="modal-content">
					<div className="modal-header">
						<span className="close" onClick={closeModelbox}>
							&times;
						</span>
						<h4>{stationDetailInfo.name}</h4>
						<div>{stationDetailInfo.address}</div>
						<div>{stationDetailInfo.city}</div>
						<div>{stationDetailInfo.openHours}</div>
					</div>
					<div className="modal-body">
						<div className="evsesId">{evDetail}</div>
					</div>
					<div className="modal-footer">

					</div>
				</div>
			) : null}
		</div>
	);
};
export default ModalBoxComponent;
