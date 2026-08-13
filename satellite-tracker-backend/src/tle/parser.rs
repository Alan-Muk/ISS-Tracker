use crate::orbit::metadata::calculate_metadata;
use crate::satellite::model::Satellite;
use crate::tle::error::TleError;

pub fn parse_tle(input: &str) -> Result<Vec<Satellite>, TleError> {
    if input.trim().is_empty() {
        return Err(TleError::EmptyInput);
    }

    let lines: Vec<_> = input.lines().filter(|l| !l.trim().is_empty()).collect();

    if lines.len() % 3 != 0 {
        return Err(TleError::InvalidRecord);
    }

    let mut satellites = Vec::new();

    for chunk in lines.chunks(3) {
        let norad_id = extract_norad_id(chunk[1]).ok_or(TleError::InvalidRecord)?;

        let name = chunk[0].to_string();

        let orbit = calculate_metadata(&name, chunk[1], chunk[2]).ok();

        satellites.push(Satellite {
            norad_id,
            name,
            line1: chunk[1].to_string(),
            line2: chunk[2].to_string(),
            orbit,
        });
    }

    Ok(satellites)
}

fn extract_norad_id(line1: &str) -> Option<u32> {
    line1
        .split_whitespace()
        .nth(1)?
        .trim_end_matches('U')
        .parse()
        .ok()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_single_satellite() {
        let input = "\
ISS (ZARYA)
1 25544U 98067A
2 25544 51.6";

        let sats = parse_tle(input).unwrap();

        assert_eq!(sats.len(), 1);
        assert_eq!(sats[0].name, "ISS (ZARYA)");
        assert_eq!(sats[0].norad_id, 25544);
    }

    #[test]
    fn parses_multiple_satellites() {
        let input = "\
ISS
1 25544U TEST
2 25544 TEST
NOAA
1 25338U TEST
2 25338 TEST";

        let sats = parse_tle(input).unwrap();

        assert_eq!(sats.len(), 2);
    }

    #[test]
    fn empty_input_returns_error() {
        assert!(matches!(parse_tle(""), Err(TleError::EmptyInput)));
    }

    #[test]
    fn malformed_input_returns_error() {
        let input = "\
ISS
1 AAA";

        assert!(matches!(parse_tle(input), Err(TleError::InvalidRecord)));
    }

    #[test]
    fn extracts_norad_id() {
        let input = "\
ISS
1 25544U TEST
2 25544 TEST";

        let sats = parse_tle(input).unwrap();

        assert_eq!(sats[0].norad_id, 25544);
    }

    #[test]
    fn parses_real_station_catalog() {
        let input = include_str!("../../data/active.tle");

        let satellites = parse_tle(input).unwrap();

        assert!(!satellites.is_empty());

        assert!(satellites.iter().any(|sat| sat.norad_id == 25544));
    }
}

#[cfg(test)]
use crate::satellite::group::SatelliteGroup;

#[test]
fn classifies_starlink() {
    let input = "\
STARLINK-11533 [DTC]
1 62836U TEST
2 62836 TEST";

    let sats = parse_tle(input).unwrap();

    assert!(matches!(sats[0].group(), SatelliteGroup::Starlink));
}
