import React, { Component } from "react";
import SliderView from "../Items/SliderView";
import Paper from "@material-ui/core/Paper";
//import FeaturesView from "../FeaturesView/FeaturesView";
import "./ConfigListView.css";
import StatelessInput from "../Items/StatelessInput";
import StatelessFloat from "../Items/StatelessFloat";
import StatelessSelect from "../Items/StatelessSelect";

export default class ConfigListView extends Component {
  render() {
    let inputs =
      (this.props.items &&
        this.props.items.filter(item => item.mode === "DIRECT")) ||
      [];
    inputs.sort();
    let dropdowns =
      (this.props.items &&
        this.props.items.filter(
          item => item.mode === "LOOKUP" || item.mode === "BITMASK"
        )) ||
      [];
    dropdowns.sort();
    let sliders =
      (this.props.items &&
        this.props.items.filter(item => item.mode === "slider")) ||
      [];
    return (
      <div className="config-list-view">
        {!!sliders.length && (
          <Paper className="config-list-view-sliders">
            {sliders.map(item => {
              return (
                <SliderView
                  className={item.id}
                  notifyDirty={this.props.notifyDirty}
                  key={item.id}
                  item={item}
                  inputVal={item.current}
                />
              );
            })}
          </Paper>
        )}
        {!!dropdowns.length && (
          <Paper className="config-list-view-dropdowns">
            {dropdowns.map(item => {
              return (
                <StatelessSelect
                  className={item.id}
                  notifyDirty={this.props.notifyDirty}
                  key={item.id}
                  id={item.id}
                />
              );
            })}
          </Paper>
        )}

        {!!inputs.length && (
          <Paper className="config-list-view-inputs">
            {inputs.map(item => {
              return item.float ? (
                <StatelessFloat
                  floatPad={item.pad || 3}
                  className={item.id}
                  notifyDirty={this.props.notifyDirty}
                  key={item.id}
                  id={item.id}
                />
              ) : (
                <StatelessInput
                  className={item.id}
                  notifyDirty={this.props.notifyDirty}
                  key={item.id}
                  id={item.id}
                />
              );
            })}
          </Paper>
        )}
      </div>
    );
  }
}
