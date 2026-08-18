using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AveriasResidenciales.Infrastructura.Context
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AveriasDbContext>
    {
        public AveriasDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AveriasDbContext>();
            optionsBuilder.UseSqlServer(
                "Data Source=ALEX\\SQLEXPRESS;Integrated Security=True;Persist Security Info=False;Pooling=False;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=True;Application Name=\"SQL Server Management Studio\";Command Timeout=0");

            return new AveriasDbContext(optionsBuilder.Options);
        }
    }
}
