using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mission11_Assignment.Data;

namespace WaterProject.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookDbContext _bookContext;

        public BookController(BookDbContext temp)
        {
            _bookContext = temp;
        }

        [HttpGet("AllBooks")]
        public IActionResult GetBooks(int pageSize = 10, int pageNum = 1, string sortOrder = "asc", [FromQuery] List<string>? bookCategories = null)
        {
            var query = _bookContext.Books.AsQueryable();

            ////if (bookCategories != null && bookCategories.Any())
            ////{
            ////    query = query.Where(b => bookCategories.Contains(b.Category));
            ////}

            ////// Apply sorting based on title
            ////if (sortOrder.ToLower() == "asc")
            ////{
            ////    query = query.OrderBy(b => b.Title);
            ////}
            ////else if (sortOrder.ToLower() == "desc")
            ////{
            ////    query = query.OrderByDescending(b => b.Title);
            ////}
            ///

            if (bookCategories != null && bookCategories.Any())
            {
                query = query.Where(b => bookCategories.Contains(b.Category));
            }

            query = sortOrder.ToLower() == "asc"
                ? query.OrderBy(b => b.Title)
                : sortOrder.ToLower() == "desc"
                    ? query.OrderByDescending(b => b.Title)
                    : query;



            var books = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var totalNumBooks = query.Count();

            var response = new
            {
                Books = books,
                TotalNumBooks = totalNumBooks
            };

            return Ok(response);
        }

        [HttpGet("GetBookTypes")]
        public IActionResult GetBookCategories()
        {
            var bookCategories = _bookContext.Books
                .Select(b => b.Category).Distinct()
                .ToList();

            return Ok(bookCategories);
        }




    }
}
