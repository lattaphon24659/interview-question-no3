using ApprovalTask.Core.Commands;
using ApprovalTask.Core.Interfaces;
using ApprovalTask.Infrastructure.Data;
using ApprovalTask.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://localhost")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddScoped<IApprovalRepository, ApprovalRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<ApprovalCommandHandler>();
var app = builder.Build();

// Apply database migrations automatically on startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();

    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        
        // For Docker environments, SQL Server might take a moment to start
        var retries = 10;
        var retryCount = 0;
        var connected = false;

        while (retryCount < retries && !connected)
        {
            try
            {
                logger.LogInformation($"Attempting database migration (Attempt {retryCount + 1}/{retries})...");
                context.Database.Migrate(); // This automatically creates the database and tables if they don't exist
                DbSeeder.SeedData(context); // Automatically seed mockup data

                connected = true;
                logger.LogInformation("Database migration applied successfully.");
            }
            catch (Exception ex)
            {
                retryCount++;
                logger.LogWarning(ex, "Failed to connect to the database. Retrying in 5 seconds...");
                if (retryCount == retries)
                {
                    logger.LogError("Max retries reached. Could not migrate database.");
                }
                else
                {
                    System.Threading.Thread.Sleep(5000);
                }
            }
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred during database migration setup.");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CorsPolicy");

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
