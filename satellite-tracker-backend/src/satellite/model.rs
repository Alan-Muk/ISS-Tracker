use serde::{Deserialize, Serialize};

use crate::satellite::{
    group::SatelliteGroup,
    metadata::OrbitMetadata,
};

use crate::orbit::region::OrbitRegion;


#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Satellite {
    pub norad_id: u32,
    pub name: String,
    pub line1: String,
    pub line2: String,

    pub orbit: Option<OrbitMetadata>,
}


impl Satellite {

    pub fn group(&self) -> SatelliteGroup {
        SatelliteGroup::from_name(&self.name)
    }


    pub fn orbit_region(&self) -> OrbitRegion {

        match &self.orbit {

            Some(orbit) =>
                OrbitRegion::from_altitude(
                    orbit.altitude_km
                ),


            None =>
                OrbitRegion::UNKNOWN,
        }

    }

}