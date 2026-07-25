use crate::{
    satellite::manager::SatelliteManager,
    tle::{
        cache::{load_cache, save_cache},
        downloader::download_tle,
        parser::parse_tle,
    },
};

const ACTIVE_URL: &str = "https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle";

pub async fn load_active_satellites(
    manager: &mut SatelliteManager,
) -> Result<usize, crate::tle::error::TleError> {
    let tle_data = match download_tle(ACTIVE_URL).await {
        Ok(data) => {
            println!("Downloaded fresh TLE data");

            save_cache(&data).await?;

            data
        }

        Err(err) => {
            println!("Using cached TLE data: {}", err);

            load_cache().await?
        }
    };

    let satellites = parse_tle(&tle_data)?;

    let count = satellites.len();

    manager.insert_many(satellites);

    Ok(count)
}
