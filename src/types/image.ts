export interface Image {
	id: string;
	author: string;
	width: number;
	height: number;
	url: string;
	download_url: string;
}

export interface PaginationInfo {
	currentPage: number;
	perPage: number;
	totalImages: number;
	totalPages: number;
}
