using AveriasResidenciales.Infrastructura.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AveriasResidenciales.Infrastructura.Context
{
    public class AveriasDbContext(DbContextOptions<AveriasDbContext> options) : DbContext(options)
    {
        public DbSet<Residente> Residentes { get; set; }
        public DbSet<Tecnico> Tecnicos { get; set; }
        public DbSet<Averia> Averias { get; set; }
        public DbSet<Seguimiento> Seguimientos { get; set; }
    }
}
