using AveriasResidenciales.Infrastructura.Interfaces.Repository;
using AveriasResidenciales.Infrastructura.Context;
using AveriasResidenciales.Infrastructura.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var MyConnectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AveriasDbContext>(option =>
{
    option.UseSqlServer(MyConnectionString);
});

builder.Services.AddScoped<IResidenteRepository, ResidenteRepository>();
builder.Services.AddScoped<ITecnicoRepository, TecnicoRepository>();
builder.Services.AddScoped<IAveriaRepository, AveriaRepository>();
builder.Services.AddScoped<ISeguimientoRepository, SeguimientoRepository>();

builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

//app.UseHttpsRedirection();
app.MapSwagger();
app.UseSwaggerUI();
app.UseCors("AllowFrontend");

app.MapControllers();

app.Run();
