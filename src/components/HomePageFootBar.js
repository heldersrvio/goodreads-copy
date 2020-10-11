import React from 'react';
import './styles/HomePageFootBar.css';

const HomePageFootBar = () => {
	return (
		<div id="homepage-footbar">
			<div className="left-section">
				<span id="connect-span">CONNECT</span>
				<div className="social-media-links">
					<a className="facebook-a" href="https://www.facebook.com/Goodreads/">
						<img
							src="https://s.gr-assets.com/assets/site_footer/footer_facebook-ea4ab848f8e86c5f5c98311bc9495a1b.svg"
							alt="Facebook logo"
						/>
					</a>
					<a className="twitter-a" href="https://twitter.com/goodreads">
						<img
							src="https://s.gr-assets.com/assets/site_footer/footer_twitter-126b3ee80481a763f7fccb06ca03053c.svg"
							alt="Twitter logo"
						/>
					</a>
					<a
						className="instagram-a"
						href="https://www.instagram.com/goodreads/"
					>
						<img
							src="https://s.gr-assets.com/assets/site_footer/footer_instagram-d59e3887020f12bcdb12e6c539579d85.svg"
							alt="Instagram logo"
						/>
					</a>
					<a
						className="linkedin-a"
						href="https://www.linkedin.com/company/goodreads-com/"
					>
						<img
							src="https://s.gr-assets.com/assets/site_footer/footer_linkedin-5b820f4703eff965672594ef4d10e33c.svg"
							alt="Linkedin logo"
						/>
					</a>
				</div>
			</div>
			<div className="right-section">
				<div className="right-section-links">
					<a
						className="iOS-a"
						href="https://itunes.apple.com/app/apple-store/id355833469?pt=325668&ct=mw_footer&mt=8"
					>
						<img
							src="https://s.gr-assets.com/assets/app/badge-ios-desktop-homepage-6ac7ae16eabce57f6c855361656a7540.svg"
							alt="Download on the App Store"
						/>
					</a>
					<a
						className="Android-a"
						href="https://play.google.com/store/apps/details?id=com.goodreads&utm_source=mw_footer&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
					>
						<img
							src="https://s.gr-assets.com/assets/app/badge-android-desktop-home-2x-e31514e1fb4dddecf9293aa526a64cfe.png"
							alt="Get it on Google Play"
						/>
					</a>
				</div>
				<span>Goodreads</span>
			</div>
		</div>
	);
};

export default HomePageFootBar;
