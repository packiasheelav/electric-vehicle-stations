import React, { Component } from 'react';
import Loader from '../../components/Loader';
import ModalBoxComponent from '../../components/ModalBoxComponent';
import Error from '../../components/Error';
import './EvStations.css';

const STATIONS_URL = 'https://api.virta.fi/v4/stations';
const STATIONS_STATUS_URL = 'https://api.virta.fi/v4/stations/status';
const STATION_URL = 'https://api.virta.fi/v4/stations/';

class Map extends Component {
	constructor(props) {
		super(props);
		this.state = {
			apiKey: 'AIzaSyCGfeG6ePnKR9c98Ubo-w3SNDTaGAiZbrM',
			map: null,
			mapConfig: {
				center: { lat: 60.192059, lng: 24.945831 },
				zoom: 13,
				disableDefaultUI: true,
				zoomControl: true
			},
			markers: [],
			show: false,
			dataStations: '',
			dataStationsStatus: '',
			stationDetailId: '',
			statusDetail: '',
			stationDetailInfo: '',
			isLoading: true,
			loading: false,
			error: ''
		};
	}

	componentDidMount() {
		this.fetchStations();
	}

	async fetchStations() {
		try {
			const [stationsResponse, stationsStatusResponse] = await Promise.all([
				fetch(STATIONS_URL),
				fetch(STATIONS_STATUS_URL)
			]);

			if (!stationsResponse.ok) {
				throw Error('StationsResponse Error : ' + stationsResponse.statusText);
			} else {
				console.log('ok');
			}

			if (!stationsStatusResponse.ok) {
				throw Error('StatusResponse error : ' + stationsStatusResponse.statusText);
			} else {
				console.log('ok');
			}

			const jsonStations = await stationsResponse.json();
			const jsonStationsStatus = await stationsStatusResponse.json();
			this.setState({ dataStations: jsonStations, isLoading: false });
			this.setState({ dataStationsStatus: jsonStationsStatus, isLoading: false });

			window.initMap = this.initMap;
			this.addScriptTag(
				'https://maps.googleapis.com/maps/api/js?key=' +
					this.state.apiKey +
					'&libraries=places&callback=initMap'
			);
		} catch (error) {
			console.log(error);
			this.setState({ error, isLoading: true });
		}
	}

	initMap = () => {
		this.setState({
			map: new window.google.maps.Map(this.refs.map, this.state.mapConfig)
		});

		this.state.dataStations.map(dataStation =>
			this.createMarker(dataStation, this.GetStatusByStationId(dataStation.id))
		);
	};

	addScriptTag = src => {
		let ref = window.document.getElementsByTagName('script')[0];
		let script = window.document.createElement('script');
		script.src = src;
		script.async = true;
		ref.parentNode.insertBefore(script, ref);
	};

	//creating and placing the marker
	createMarker = (stationData, statusData) => {
		let place = { lat: stationData.latitude, lng: stationData.longitude };
		const marker = new window.google.maps.Marker({
			position: place,
			map: this.state.map,
			icon: '/icon.png',
			stationDataId: stationData.id,
			statusData: statusData
		});
		//eventlistener for each marker
		window.google.maps.event.addListener(marker, 'click', () => this.showModalBox(stationData.id));

		this.state.markers.push(marker);
		//pan the map location according to lat and long
		this.state.map.panTo({ lat: this.state.mapConfig.center.lat, lng: this.state.mapConfig.center.lng });
	};

	GetStatusByStationId = stationId => {
		for (var i = 0; i < this.state.dataStationsStatus.length; i++) {
			if (this.state.dataStationsStatus[i].id === stationId) {
				return this.state.dataStationsStatus[i];
			}
		}
		return null;
	};

	//fetch api for showing status of the station
	async GetStationInfo(id) {
		try {
			const [stationsResponse] = await Promise.all([fetch(STATION_URL + id)]);
			if (!stationsResponse.ok) {
				throw Error(stationsResponse.statusText);
			} else {
				console.log('ok');
			}
			const stationDetailInfo = await stationsResponse.json();
			this.setState({ stationDetailInfo: stationDetailInfo });
		} catch (error) {
			console.log(error);
			this.setState({ stationDetailInfo: '' });
		}
	}

	showModalBox = id => {
		for (var i = 0; i < this.state.markers.length; i++) {
			if (this.state.markers[i].stationDataId === id) {
				this.GetStationInfo(id);
				this.setState({
					statusDetail: this.state.markers[i].statusData
				});
				this.state.map.panTo(this.state.markers[i].position);
				break;
			}
		}
		this.setState({ show: true });
	};

	closeModelbox = () => {
		this.setState({ show: false });
	};

	renderStationsData() {
		return (
			<div>
				<div ref="map" id="mapId" />
				<ModalBoxComponent
					show={this.state.show}
					closeModelbox={this.closeModelbox}
					statusDetail={this.state.statusDetail}
					stationDetailInfo={this.state.stationDetailInfo}
				/>
			</div>
		);
	}

	render() {
		const { isLoading, error } = this.state;

		if (error) {
			return <Error error={error} />;
		}

		if (isLoading) {
			return <Loader />;
		}
		return <div>{this.renderStationsData()}</div>;
	}
}
export default Map;
