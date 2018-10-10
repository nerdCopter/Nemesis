import React, { Component } from "react";
import InputView from "../Items/InputView";
import DropdownView from "../Items/DropdownView";
import FeaturesView from "../FeaturesView/FeaturesView";
import Paper from "@material-ui/core/Paper";
import { AreaChart } from "react-easy-chart";
import biquad from "./biquad";
import "./FiltersView.css";

export default class FiltersView extends Component {
  render() {
    let bqData, notchData;
    let bqColors = ["blue", "white", "green"];
    let notchDomainMax = 500;
    let use32K =
      this.props.fcConfig.version.imuf ||
      (this.props.fcConfig.gyro_use_32khz &&
        this.props.fcConfig.gyro_use_32khz.current === "ON");
    let freq =
      (use32K ? 32000 : 8000) /
      parseInt(this.props.fcConfig.gyro_sync_denom.current, 10);
    if (this.props.fcConfig.imuf) {
      bqData = [
        biquad(
          "lowpass",
          parseInt(this.props.fcConfig.imuf_roll_lpf_cutoff_hz.current, 10),
          freq
        ).plot,
        biquad(
          "lowpass",
          parseInt(this.props.fcConfig.imuf_pitch_lpf_cutoff_hz.current, 10),
          freq
        ).plot,
        biquad(
          "lowpass",
          parseInt(this.props.fcConfig.imuf_yaw_lpf_cutoff_hz.current, 10),
          freq
        ).plot
      ];
    } else {
      let cutoff1 = parseInt(
          this.props.fcConfig.gyro_notch1_cutoff.current,
          10
        ),
        cutoff2 = parseInt(this.props.fcConfig.gyro_notch2_cutoff.current, 10),
        hz1 = parseInt(this.props.fcConfig.gyro_notch1_hz.current, 10),
        hz2 = parseInt(this.props.fcConfig.gyro_notch2_hz.current, 10);
      notchDomainMax = Math.floor(Math.min(cutoff1, cutoff2, hz1, hz2) / 2);
      bqData = [
        biquad(
          "lowpass",
          parseInt(this.props.fcConfig.gyro_lowpass_hz.current, 10),
          freq
        ).plot,
        biquad(
          "lowpass",
          parseInt(this.props.fcConfig.gyro_lowpass2_hz.current, 10),
          freq
        ).plot
      ];
      notchData = [
        biquad("notch", hz1, freq, cutoff1).plot,
        biquad("notch", hz2, freq, cutoff2).plot
      ];
    }
    return (
      <div
        className="filters-view"
        style={{ display: "flex", flexDirection: "column" }}
      >
        {!this.props.fcConfig.imuf && (
          <FeaturesView
            fcConfig={this.props.fcConfig}
            features={this.props.features}
            notifyDirty={this.props.notifyDirty}
          />
        )}
        {this.props.fcConfig.imuf ? (
          <div style={{ flex: 1 }}>
            <Paper elevation={3}>
              <InputView
                notifyDirty={this.props.notifyDirty}
                item={this.props.fcConfig.imuf_roll_q}
              />
              <InputView
                notifyDirty={this.props.notifyDirty}
                item={this.props.fcConfig.imuf_pitch_q}
              />
              <InputView
                notifyDirty={this.props.notifyDirty}
                item={this.props.fcConfig.imuf_yaw_q}
              />
            </Paper>
            <Paper elevation={3} style={{ display: "flex" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <InputView
                  notifyDirty={(isDirty, state, val) => {
                    this.props.fcConfig.imuf_roll_lpf_cutoff_hz.current = val;
                    this.forceUpdate();
                    this.props.notifyDirty(isDirty, state, val);
                  }}
                  item={this.props.fcConfig.imuf_roll_lpf_cutoff_hz}
                />
                <InputView
                  notifyDirty={(isDirty, state, val) => {
                    this.props.fcConfig.imuf_pitch_lpf_cutoff_hz.current = val;
                    this.forceUpdate();
                    this.props.notifyDirty(isDirty, state, val);
                  }}
                  item={this.props.fcConfig.imuf_pitch_lpf_cutoff_hz}
                />
                <InputView
                  notifyDirty={(isDirty, state, val) => {
                    this.props.fcConfig.imuf_yaw_lpf_cutoff_hz.current = val;
                    this.forceUpdate();
                    this.props.notifyDirty(isDirty, state, val);
                  }}
                  item={this.props.fcConfig.imuf_yaw_lpf_cutoff_hz}
                />
              </div>

              <div class="area-chart-container">
                <AreaChart
                  data={bqData}
                  areaColors={bqColors}
                  yDomainRange={[-100, 0]}
                  xDomainRange={[0, 500]}
                  axisLabels={{ x: "Frequency", y: "Attenuation" }}
                  axes
                  width={450}
                  height={350}
                />
              </div>
            </Paper>
            <Paper
              elevation={3}
              style={{
                display: "flex",
                justifyItems: "center",
                alignItems: "center"
              }}
            >
              <DropdownView
                notifyDirty={this.props.notifyDirty}
                item={this.props.fcConfig.imuf_roll_af}
              />
              <DropdownView
                notifyDirty={this.props.notifyDirty}
                item={this.props.fcConfig.imuf_pitch_af}
              />
              <DropdownView
                notifyDirty={this.props.notifyDirty}
                item={this.props.fcConfig.imuf_yaw_af}
              />
              <InputView
                notifyDirty={this.props.notifyDirty}
                item={this.props.fcConfig.imuf_w}
              />
            </Paper>
          </div>
        ) : (
          <div style={{ flex: 1 }}>
            <Paper
              elevation={3}
              style={{
                display: "flex",
                justifyItems: "center",
                alignItems: "center"
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyItems: "flex-start",
                  alignItems: "flex-start"
                }}
              >
                <DropdownView
                  notifyDirty={this.props.notifyDirty}
                  item={this.props.fcConfig.gyro_lowpass_type}
                />
                {this.props.fcConfig.gyro_lowpass_type.current !== "KALMAN" && (
                  <InputView
                    notifyDirty={this.props.notifyDirty}
                    item={this.props.fcConfig.gyro_lowpass_hz}
                  />
                )}
                {this.props.fcConfig.gyro_lowpass_type.current === "KALMAN" && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyItems: "flex-start",
                      alignItems: "flex-start",
                      marginRight: 10
                    }}
                  >
                    <InputView
                      notifyDirty={this.props.notifyDirty}
                      item={this.props.fcConfig.gyro_filter_q}
                    />
                    <InputView
                      notifyDirty={this.props.notifyDirty}
                      item={this.props.fcConfig.gyro_filter_r}
                    />
                  </div>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyItems: "flex-start",
                  alignItems: "flex-start"
                }}
              >
                <DropdownView
                  notifyDirty={this.props.notifyDirty}
                  item={this.props.fcConfig.gyro_lowpass2_type}
                />
                <InputView
                  notifyDirty={this.props.notifyDirty}
                  item={this.props.fcConfig.gyro_lowpass2_hz}
                />
              </div>
              <div className="area-chart-container">
                <AreaChart
                  data={bqData}
                  areaColors={bqColors}
                  yDomainRange={[-100, 0]}
                  xDomainRange={[0, 500]}
                  axesLabels={{ x: "Frequency", y: "Attenuation" }}
                  axes
                  width={350}
                  height={250}
                />
              </div>
            </Paper>
            <Paper
              elevation={3}
              style={{
                display: "flex",
                justifyItems: "center",
                alignItems: "center"
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyItems: "flex-start",
                  alignItems: "flex-start"
                }}
              >
                <InputView
                  notifyDirty={this.props.notifyDirty}
                  item={this.props.fcConfig.gyro_notch1_hz}
                />
                <InputView
                  notifyDirty={this.props.notifyDirty}
                  item={this.props.fcConfig.gyro_notch1_cutoff}
                />
                <InputView
                  notifyDirty={this.props.notifyDirty}
                  item={this.props.fcConfig.gyro_notch2_hz}
                />
                <InputView
                  notifyDirty={this.props.notifyDirty}
                  item={this.props.fcConfig.gyro_notch2_cutoff}
                />
              </div>
              <div className="area-chart-container">
                <AreaChart
                  data={notchData}
                  areaColors={bqColors}
                  yDomainRange={[-60, 10]}
                  xDomainRange={[0, notchDomainMax]}
                  axisLabels={{ x: "Frequency", y: "Attenuation" }}
                  width={350}
                  height={250}
                />
              </div>
            </Paper>
          </div>
        )}
      </div>
    );
  }
}
