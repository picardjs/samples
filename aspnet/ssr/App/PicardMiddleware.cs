using System.Text;

namespace App;

/// <summary>
/// Lets the Picard.js decorator service render the micro frontends into the HTML
/// produced by ASP.NET Core and serves the files of the islands script.
/// </summary>
public class PicardMiddleware(RequestDelegate next, IHttpClientFactory clients)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var client = clients.CreateClient("picard");

        if (HttpMethods.IsGet(context.Request.Method) && context.Request.Path.StartsWithSegments("/picard", out var file))
        {
            // the files of the islands script are served by the decorator service
            using var script = await client.GetAsync($"picard{file}", context.RequestAborted);
            context.Response.StatusCode = (int)script.StatusCode;
            context.Response.ContentType = "text/javascript";
            await script.Content.CopyToAsync(context.Response.Body, context.RequestAborted);
            return;
        }

        if (Path.HasExtension(context.Request.Path.Value))
        {
            // static files are not decorated
            await next(context);
            return;
        }

        var original = context.Response.Body;
        using var buffer = new MemoryStream();
        context.Response.Body = buffer;

        try
        {
            await next(context);
        }
        finally
        {
            context.Response.Body = original;
        }

        buffer.Position = 0;

        if (context.Response.ContentType?.StartsWith("text/html") == true)
        {
            // the decorator renders the micro frontends into the pi-* elements
            var html = await new StreamReader(buffer, Encoding.UTF8).ReadToEndAsync(context.RequestAborted);
            using var content = new StringContent(html, Encoding.UTF8, "text/html");
            using var response = await client.PostAsync("decorate", content, context.RequestAborted);
            response.EnsureSuccessStatusCode();
            var result = await response.Content.ReadAsByteArrayAsync(context.RequestAborted);
            context.Response.ContentLength = result.Length;
            await original.WriteAsync(result, context.RequestAborted);
        }
        else
        {
            await buffer.CopyToAsync(original, context.RequestAborted);
        }
    }
}

public static class PicardExtensions
{
    /// <summary>
    /// Registers the HTTP client for the Picard.js decorator service.
    /// </summary>
    public static IServiceCollection AddPicard(this IServiceCollection services, IConfiguration configuration)
    {
        var url = configuration["Picard:Url"] ?? "http://localhost:5100/";
        services.AddHttpClient("picard", client => client.BaseAddress = new Uri(url));
        return services;
    }

    /// <summary>
    /// Adds the middleware decorating the HTML responses with the micro frontends.
    /// </summary>
    public static IApplicationBuilder UsePicard(this IApplicationBuilder app) => app.UseMiddleware<PicardMiddleware>();
}
