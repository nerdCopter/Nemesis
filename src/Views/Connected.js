import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
//import AuxChannelView from "./AuxChannelView/AuxChannelView";
import ConfigListView from "./ConfigListView/ConfigListView";
//import FeaturesView from "./FeaturesView/FeaturesView";
//import PortsView from "./PortsView/PortsView";
//import FiltersView from "./FiltersView/FiltersView";
//import PidsView from "./PidView/PidView";
//import RatesView from "./RatesView/RatesView";
import AppBarView from "./AppBarView/AppBarView";
import FCConnector from "../utilities/FCConnector";
//import AssistantView from "./Assistants/AssistantView";
//import ProfileView from "./ProfileView/ProfileView";
//import BlackboxView from "./BlackboxView/BlackboxView";
//import RXView from "./RXView/RXView";
//import MotorsView from "./MotorsView/MotorsView";
//import OSDView from "./OSDView/OSDView";
import "./Connected.css";
import { FCConfigContext } from "../App";
//import PreFlightCheckView from "./PreFlightCheckView/PreFlightCheckView";
import ResponsiveDrawerView from "./ResponsiveDrawerView";

export default class Connected extends Component {
  constructor(props) {
    super(props);
    this.routes = props.fcConfig.routes;
    this.routeFeatures = props.fcConfig.routeFeatures;
    this.state = {
      theme: props.theme,
      isBxF: props.fcConfig.isBxF,
      pid_profile: props.fcConfig.currentPidProfile,
      rate_profile: props.fcConfig.currentRateProfile,
      craftName: props.fcConfig.name,
      isDirty: false,
      mobileOpen: false,
      currentRoute: props.fcConfig.startingRoute
    };
  }

  getRouteFeatures(key) {
    if (this.routeFeatures[key]) {
      return this.props.fcConfig.features.values
        .filter(feat => {
          return this.routeFeatures[key].indexOf(feat.id) > -1;
        })
        .map(feature => {
          if (feature.hasPort) {
            feature.ports = this.props.fcConfig.ports;
          }
          return feature;
        });
    }
  }

  getRouteItems = (fcConfig, sort = false) => {
    let keys = Object.keys(fcConfig);
    if (sort) {
      keys.sort();
    }
    return keys
      .filter(key => {
        if (this.state.filterOn) {
          return (
            fcConfig[key].id &&
            fcConfig[key].id.indexOf(this.state.filterOn) > -1
          );
        }
        if (this.state.currentRoute.key === "ADVANCED") {
          return fcConfig[key].id && !fcConfig[key].route;
        }
        return fcConfig[key].route === this.state.currentRoute.key;
      })
      .map(k => fcConfig[k]);
  };

  handleDrawerToggle = () => {
    if (this.state.mobileOpen) {
      FCConnector.pauseTelemetry();
    } else {
      FCConnector.resumeTelemetry();
    }
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  handleClickAway = () => {
    if (this.state.mobileOpen) {
      this.setState({ mobileOpen: false });
    }
  };

  handleSearch = event => {
    this.setState({ filterOn: event.target.value });
  };

  handleSave = () => {
    this.setState({ isDirty: false });
    return this.props.handleSave().then(config => {
      this.setState({ fcConfig: config });
    });
  };

  handleMenuItemClick = key => {
    let newRoute = this.routes.find(route => route.key === key);
    if (this.state.isDirty) {
      // this.handleSave();
      //TODO: save EEPROM
    }
    this.setState({
      filterOn: undefined,
      mobileOpen: false,
      currentRoute: newRoute
    });
  };

  notifyDirty = (isDirty, item, newValue) => {
    if (isDirty) {
      this.setState({ isDirty: isDirty });
    }
  };

  openAssistant(routeName) {
    FCConnector.pauseTelemetry();
    this.setState({ openAssistant: true, assistantType: routeName });
  }
  closeAssistant() {
    this.setState({ openAssistant: false, assistantType: "" });
    FCConnector.resumeTelemetry();
  }
  render() {
    let contents;
    let mergedProfile = this.props.fcConfig;
    switch (this.state.currentRoute.key) {
      //       case "PFC":
      //        contents = (
      //          <PreFlightCheckView
      //            goToImuf={this.props.goToImuf}
      //            fcConfig={mergedProfile}
      //            handleSave={this.handleSave}
      //            modelUrl={this.state.theme.modelUrl}
      //            openAssistant={name => this.openAssistant(name)}
      //          />
      //        );
      //        break;

      default:
        contents = (
          <ConfigListView
            fcConfig={mergedProfile}
            features={this.getRouteFeatures(this.state.currentRoute.key)}
            notifyDirty={(isDirty, item, newValue) =>
              this.notifyDirty(isDirty, item, newValue)
            }
            items={this.getRouteItems(mergedProfile, true)}
          />
        );
        break;
    }

    return (
      <Paper className={`connected-root ${mergedProfile.version.fw}`}>
        <FCConfigContext.Provider value={mergedProfile}>
          <AppBarView
            rebooting={this.props.rebooting}
            position="absolute"
            handleDrawerToggle={this.handleDrawerToggle}
            handleSearch={this.handleSearch}
            onSave={this.handleSave}
            notifyDirty={(isDirty, item, newValue) =>
              this.notifyDirty(isDirty, item, newValue)
            }
            title={this.state.currentRoute.title}
            fcConfig={mergedProfile}
            isDirty={this.state.isDirty}
          />
          <ResponsiveDrawerView
            routes={this.routes}
            goToImuf={this.props.goToImuf}
            fcConfig={mergedProfile}
            mobileOpen={this.state.mobileOpen}
            onClose={() => {
              this.setState({ mobileOpen: false });
            }}
            handleMenuItemClick={this.handleMenuItemClick}
            handleClickAway={this.handleClickAway}
            appVersion={this.props.appVersion}
          />
          {contents}
        </FCConfigContext.Provider>
      </Paper>
    );
  }
}
