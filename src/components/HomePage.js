import React, { useState } from 'react';
import PropTypes from 'prop-types';
import HomePageTopSection from './HomePageTopSection';
import HomePageBottomSectiom from './HomePageBottomSection';

const HomePage = (props) => {
	return (
		<div id="homepage">
			<HomePageTopSection signIn={props.signIn} />
			<HomePageBottomSectiom
				recExample1={{
					userName: 'Shomeret',
					gender: 'f',
					bookList: [
						'Animals in Translation',
						'Animals Make Us Human',
						'Some We Love, Some We Hate, Some We Eat',
					],
					bookLinkList: [
						'/book/show/7366.Animals_in_Translation',
						'/book/show/4386485-animals-make-us-human',
						'/book/show/6953508-some-we-love-some-we-hate-some-we-eat',
					],
					bookCoverList: [
						'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1442375726l/7366._SX98_.jpg',
						'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1348264535l/4386485._SX98_.jpg',
						'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1369453733l/6953508._SX98_.jpg',
					],
					recBook: 'Next of Kin',
					recBookLink: '/book/show/325779.Next_of_Kin',
					recBookCover:
						'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1348810069l/325779._SX98_.jpg',
					source: 'Psychology, Animals, Science, Nature',
				}}
				recExample2={{
					userName: '♥Meagan♥',
					gender: 'f',
					bookList: [
						'Memoirs of a Geisha',
						'The Guernsey Literary and Potato Peel Pie Society',
						'Water for Elephants',
						'The Help',
					],
					bookLinkList: [
						'/book/show/929.Memoirs_of_a_Geisha',
						'/book/show/39832183-the-guernsey-literary-and-potato-peel-pie-society',
						'/book/show/43641.Water_for_Elephants',
						'/book/show/4667024-the-help',
					],
					bookCoverList: [
						'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1409595968l/929._SX98_.jpg',
						'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1529026760l/39832183._SX98_.jpg',
						'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1494428973l/43641._SX98_.jpg',
						'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1572940430l/4667024._SX98_.jpg',
					],
					recBook: "Moloka'i",
					recBookLink: '/book/show/3273.Moloka_i',
					recBookCover:
						'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1441920261l/3273._SX98_.jpg',
					source: 'Historical Fiction, Book Club',
				}}
				popularLists={[
					{
						title: 'Best Crime & Mystery Books',
						link: '/list/show/11.Best_Crime_Mystery_Books',
						bookQuantity: 6010,
						voterQuantity: 14187,
						topBookNames: [
							'The Girl with the Dragon Tattoo',
							'And Then There Were None',
							'Angels & Demons',
							'Rebecca',
						],
						topBookCovers: [
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1327868566l/2429135._SX50_.jpg',
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1391120695l/16299._SY75_.jpg',
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1558711679l/960._SY75_.jpg',
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1386605169l/17899948._SX50_.jpg',
						],
						topBookLinks: [
							'/book/show/2429135.The_Girl_with_the_Dragon_Tattoo',
							'/book/show/16299.And_Then_There_Were_None',
							'/book/show/960.Angels_Demons',
							'/book/show/17899948-rebecca',
						],
					},
					{
						title: 'Best for Book Clubs',
						link: '/list/show/19.Best_for_Book_Clubs',
						bookQuantity: 6922,
						voterQuantity: 12713,
						topBookNames: [
							'The Help',
							'The Kite Runner',
							'Water for Elephants',
							'The Book Thief',
						],
						topBookCovers: [
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1572940430l/4667024._SY75_.jpg',
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1579036753l/77203._SY75_.jpg',
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1494428973l/43641._SY75_.jpg',
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1522157426l/19063._SY75_.jpg',
						],
						topBookLinks: [
							'/book/show/4667024-the-help',
							'/book/show/77203.The_Kite_Runner',
							'/book/show/43641.Water_for_Elephants',
							'/book/show/19063.The_Book_Thief',
						],
					},
					{
						title: 'Best Books of the 20th Century',
						link: '/list/show/6.Best_Books_of_the_20th_Century',
						bookQuantity: 7550,
						voterQuantity: 49369,
						topBookNames: [
							'To Kill a Mockingbird',
							'1984',
							"Harry Potter and the Sorcerer's Stone",
							'The Great Gatsby',
						],
						topBookCovers: [
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1553383690l/2657._SY75_.jpg',
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1532714506l/40961427._SX50_.jpg',
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1474154022l/3._SY75_.jpg',
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1490528560l/4671._SY75_.jpg',
						],
						topBookLinks: [
							'/book/show/2657.To_Kill_a_Mockingbird',
							'/book/show/40961427-1984',
							'book/show/3.Harry_Potter_and_the_Sorcerer_s_Stone',
							'/book/show/4671.The_Great_Gatsby',
						],
					},
				]}
			/>
		</div>
	);
};

HomePage.propTypes = {
	signIn: PropTypes.func,
};

export default HomePage;
