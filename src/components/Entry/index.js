/* global Skycons */

import React, { Component } from 'react';

const config = require('../../config.json');

class Entry extends Component {
	skycons = null;

	constructor(props) {
		super(props);

		this.skycons = new Skycons({
			'color': '#000',
		});

		this.state = {
			date: new Date(props.entry.datetime),
			morning: {
				summary: '',
				icon: '',
				temperature: 0,
				precipProbability: 0,
			},
			day: {
				summary: '',
				icon: '',
				temperature: 0,
				precipProbability: 0,
			},
			evening: {
				summary: '',
				icon: '',
				temperature: 0,
				precipProbability: 0,
			},
		};
	}

	componentWillMount() {
		const { entry } = this.props;

		fetch(`${config.proxyUrl}/${entry.latlng},${entry.datetime}`)
			.then(res => res.json())
			.then(this.onFetch);
	}

	onFetch = (json) => {
		const hourly = json.hourly.data;

		this.setState({
			morning: {
				summary: hourly[4].summary,
				icon: hourly[4].icon,
				temperature: hourly[4].temperature,
				precipProbability: hourly[4].precipProbability,
			},
			day: {
				summary: hourly[13].summary,
				icon: hourly[13].icon,
				temperature: hourly[13].temperature,
				precipProbability: hourly[13].precipProbability,
			},
			evening: {
				summary: hourly[20].summary,
				icon: hourly[20].icon,
				temperature: hourly[20].temperature,
				precipProbability: hourly[20].precipProbability,
			},
		});
	}

	f2c = (f) => Math.round((f - 32) / 1.8);

	probability = (prob) => {
		return Math.round((prob || 0) * 100);
	};

	initIcon = (canvas, icon) => {
		if (!canvas) {
			return;
		}

		this.skycons.add(canvas, icon);
		this.skycons.play();
	};

	isOld = () => {
		const entryDate = Object.assign(this.state.date);
		const now = new Date();
		const syncedEntryDate = new Date();

		syncedEntryDate.setDate(entryDate.getDate());
		syncedEntryDate.setMonth(entryDate.getMonth());

		return syncedEntryDate.getTime() < now.getTime();
	};

	renderDate = () => {
		if (!this.state.date) {
			return;
		}

		return `${this.state.date.getDate()}.${this.state.date.getMonth() + 1}.`;
	};

	render() {
		const { entry } = this.props;
		const { morning, day, evening } = this.state;

		return (
			<tr className={this.isOld() ? 'old' : ''}>
				<td className="date">{this.renderDate(entry.datetime)}</td>
				<td className="name" title={entry.latlng}><a href={`https://www.google.com/maps/search/?api=1&query=${entry.latlng}`} target="blank">{entry.name}</a></td>
				<td className="info"><canvas ref={canvas => this.initIcon(canvas, morning.icon)} width="32" height="32"></canvas></td>
				<td className="info">{this.f2c(morning.temperature)}&deg;</td>
				<td className="info">{this.probability(morning.precipProbability)}%</td>
				<td className="info"><canvas ref={canvas => this.initIcon(canvas, day.icon)} width="32" height="32"></canvas></td>
				<td className="info">{this.f2c(day.temperature)}&deg;</td>
				<td className="info">{this.probability(day.precipProbability)}%</td>
				<td className="info"><canvas ref={canvas => this.initIcon(canvas, evening.icon)} width="32" height="32"></canvas></td>
				<td className="info">{this.f2c(evening.temperature)}&deg;</td>
				<td className="info">{this.probability(evening.precipProbability)}%</td>
			</tr>
		);
	}
}

export default Entry;
