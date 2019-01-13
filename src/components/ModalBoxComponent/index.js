import React from 'react';
import StatusDetails from '../StatusDetail';
import './ModalBox.css';

const ModalBoxComponent = ({ closeModelbox, show, statusDetail, handleStationClick, stationDetailInfo }) => {

	if (!statusDetail || !stationDetailInfo) {
		return <div>loading...</div>;
	}

	return (
		<div className={show ? 'modal display-block' : 'modal display-none'}>
			<div className="overlay" onClick={closeModelbox} />
			{stationDetailInfo !== undefined ? (
				<div className="modal-content" >
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
					<StatusDetails statusDetail={statusDetail} stationDetailInfo={stationDetailInfo}/>
					</div>
					<div className="modal-footer">
					</div>
				</div>
			) : null}
		</div>
	);
};
export default ModalBoxComponent;
